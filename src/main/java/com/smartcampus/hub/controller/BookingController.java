package com.smartcampus.hub.controller;

import com.smartcampus.hub.dto.BookingFilterDTO;
import com.smartcampus.hub.dto.BookingRequestDTO;
import com.smartcampus.hub.dto.BookingResponseDTO;
import com.smartcampus.hub.dto.BookingStatusUpdateDTO;
import com.smartcampus.hub.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for managing resource bookings (v1).
 * Integrates with Spring Security for role-based access control.
 */
@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final com.smartcampus.repository.UserRepository userRepository;

    /**
     * Creates a new booking request.
     * Accessible by authenticated users with ROLE_USER or ROLE_ADMIN.
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<BookingResponseDTO> createBooking(@Valid @RequestBody BookingRequestDTO dto) {
        Long userId = getCurrentUserId();
        return new ResponseEntity<>(bookingService.createBooking(dto, userId), HttpStatus.CREATED);
    }

    /**
     * Retrieves bookings belonging to the authenticated user.
     */
    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<BookingResponseDTO>> getUserBookings() {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(bookingService.getUserBookings(userId));
    }

    /**
     * Retrieves all bookings with optional filters (Admin only).
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BookingResponseDTO>> getAllBookings(@Valid BookingFilterDTO filter) {
        return ResponseEntity.ok(bookingService.getAllBookings(filter));
    }

    /**
     * Retrieves a specific booking by ID.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<BookingResponseDTO> getBookingById(@PathVariable("id") Long id) {
        Long userId = getCurrentUserId();
        String role = getCurrentUserRole();
        return ResponseEntity.ok(bookingService.getBookingById(id, userId, role));
    }

    /**
     * Approves or rejects a booking (Admin only).
     */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookingResponseDTO> updateBookingStatus(
            @PathVariable("id") Long id,
            @Valid @RequestBody BookingStatusUpdateDTO dto) {
        Long adminId = getCurrentUserId();
        return ResponseEntity.ok(bookingService.approveOrRejectBooking(id, dto, adminId));
    }

    /**
     * Cancels a booking.
     */
    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<BookingResponseDTO> cancelBooking(@PathVariable("id") Long id) {
        Long userId = getCurrentUserId();
        String role = getCurrentUserRole();
        return ResponseEntity.ok(bookingService.cancelBooking(id, userId, role));
    }

    /**
     * Hard deletes a booking record (Admin only).
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBooking(@PathVariable("id") Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Helper method to extract the user ID from the Security Context.
     * Note: Implementation depends on how UserDetails is configured.
     */
    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String identifier = auth.getName();
        try {
            return Long.valueOf(identifier);
        } catch (NumberFormatException e) {
            // If the identifier is an email (e.g., from mock token or OAuth), look up the user ID
            return userRepository.findByEmail(identifier)
                    .map(com.smartcampus.entity.User::getId)
                    .orElseThrow(() -> new RuntimeException("User not found for identifier: " + identifier));
        }
    }

    /**
     * Helper method to extract the user's primary role.
     */
    private String getCurrentUserRole() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getAuthorities().stream()
                .map(a -> a.getAuthority().replace("ROLE_", ""))
                .findFirst()
                .orElse("USER");
    }
}
