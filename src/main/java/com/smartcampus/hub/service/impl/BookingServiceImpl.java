package com.smartcampus.hub.service.impl;

import com.smartcampus.hub.dto.*;
import com.smartcampus.hub.entity.*;
import com.smartcampus.hub.exception.*;
import com.smartcampus.hub.mapper.BookingMapper;
import com.smartcampus.hub.repository.BookingRepository;
import com.smartcampus.hub.repository.ResourceRepository;
import com.smartcampus.hub.repository.UserRepository;
import com.smartcampus.hub.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of {@link BookingService} handling business logic for bookings.
 */
@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;
    private final BookingMapper bookingMapper;

    @Override
    @Transactional
    public BookingResponseDTO createBooking(BookingRequestDTO dto, Long userId) {
        // 1. Load Resource
        Resource resource = resourceRepository.findById(dto.getResourceId())
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with ID: " + dto.getResourceId()));

        // 2. Check Resource Status
        if ("OUT_OF_SERVICE".equalsIgnoreCase(resource.getStatus())) {
            throw new IllegalStateException("Resource is currently out of service and cannot be booked.");
        }

        // 3. Load User
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        // 4. Check for Scheduling Conflicts
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                dto.getResourceId(),
                dto.getBookingDate(),
                dto.getStartTime(),
                dto.getEndTime()
        );

        if (!conflicts.isEmpty()) {
            throw new BookingConflictException("The requested time slot overlaps with an existing approved booking.");
        }

        // 5. Create Booking
        Booking booking = bookingMapper.toEntity(dto);
        booking.setResource(resource);
        booking.setRequestedBy(user);
        booking.setStatus(BookingStatus.PENDING);

        // 6. Save and Return
        Booking savedBooking = bookingRepository.save(booking);
        return bookingMapper.toResponseDTO(savedBooking);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getUserBookings(Long userId) {
        return bookingRepository.findByRequestedBy_Id(userId).stream()
                .map(bookingMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getAllBookings(BookingFilterDTO filter) {
        // Convert dynamic status name if necessary, though repository handles it as Enum or null-safe check
        BookingStatus statusEnum = null;
        if (filter.getStatus() != null) {
            try {
                statusEnum = BookingStatus.valueOf(filter.getStatus().toUpperCase());
            } catch (IllegalArgumentException e) {
                // Invalid status provided in filter, return empty or handle accordingly
                return List.of();
            }
        }

        return bookingRepository.findWithOptionalFilters(
                filter.getResourceId(),
                statusEnum,
                filter.getBookingDate()
        ).stream()
                .map(bookingMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponseDTO getBookingById(Long bookingId, Long userId, String role) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with ID: " + bookingId));

        // Role-based access control
        if ("USER".equalsIgnoreCase(role) && !booking.getRequestedBy().getId().equals(userId)) {
            throw new RuntimeException("Access Denied: You cannot view bookings requested by other users.");
        }

        return bookingMapper.toResponseDTO(booking);
    }

    @Override
    @Transactional
    public BookingResponseDTO approveOrRejectBooking(Long bookingId, BookingStatusUpdateDTO dto, Long adminId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with ID: " + bookingId));

        // Ensure booking is in PENDING status
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new InvalidBookingStateException("Only PENDING bookings can be approved or rejected. Current status: " + booking.getStatus());
        }

        // Apply status update
        booking.setStatus(dto.getStatus());
        if (BookingStatus.REJECTED.equals(dto.getStatus())) {
            booking.setRejectionReason(dto.getRejectionReason());
        }

        Booking updatedBooking = bookingRepository.save(booking);
        return bookingMapper.toResponseDTO(updatedBooking);
    }

    @Override
    @Transactional
    public BookingResponseDTO cancelBooking(Long bookingId, Long userId, String role) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with ID: " + bookingId));

        // USER can only cancel their own bookings; ADMIN can cancel any
        if ("USER".equalsIgnoreCase(role) && !booking.getRequestedBy().getId().equals(userId)) {
            throw new RuntimeException("Access Denied: You cannot cancel bookings requested by other users.");
        }

        // Only APPROVED or PENDING bookings can be cancelled
        if (booking.getStatus() != BookingStatus.PENDING && booking.getStatus() != BookingStatus.APPROVED) {
            throw new InvalidBookingStateException("Only PENDING or APPROVED bookings can be cancelled. Current status: " + booking.getStatus());
        }

        booking.setStatus(BookingStatus.CANCELLED);
        Booking updatedBooking = bookingRepository.save(booking);
        return bookingMapper.toResponseDTO(updatedBooking);
    }

    @Override
    @Transactional
    public void deleteBooking(Long bookingId) {
        if (!bookingRepository.existsById(bookingId)) {
            throw new BookingNotFoundException("Booking not found with ID: " + bookingId);
        }
        bookingRepository.deleteById(bookingId);
    }
}
