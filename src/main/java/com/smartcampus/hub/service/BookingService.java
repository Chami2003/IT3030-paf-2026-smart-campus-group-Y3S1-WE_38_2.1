package com.smartcampus.hub.service;

import com.smartcampus.hub.dto.BookingFilterDTO;
import com.smartcampus.hub.dto.BookingRequestDTO;
import com.smartcampus.hub.dto.BookingResponseDTO;
import com.smartcampus.hub.dto.BookingStatusUpdateDTO;

import java.util.List;

/**
 * Service interface for managing resource bookings.
 */
public interface BookingService {

    /**
     * Creates a new booking request.
     *
     * @param dto    The booking request data.
     * @param userId The ID of the user making the request.
     * @return The created booking response data.
     */
    BookingResponseDTO createBooking(BookingRequestDTO dto, Long userId);

    /**
     * Retrieves all bookings made by a specific user.
     *
     * @param userId The user ID.
     * @return A list of booking responses.
     */
    List<BookingResponseDTO> getUserBookings(Long userId);

    /**
     * Retrieves all bookings based on optional filters (Admin only).
     *
     * @param filter The filtering criteria.
     * @return A list of booking responses.
     */
    List<BookingResponseDTO> getAllBookings(BookingFilterDTO filter);

    /**
     * Retrieves a specific booking by ID with access control checks.
     *
     * @param bookingId The booking ID.
     * @param userId    The ID of the user requesting information.
     * @param role      The role of the user (e.g., USER, ADMIN).
     * @return The booking response data.
     */
    BookingResponseDTO getBookingById(Long bookingId, Long userId, String role);

    /**
     * Approves or rejects a pending booking (Admin only).
     *
     * @param bookingId The booking ID.
     * @param dto       The status update data.
     * @param adminId   The ID of the admin performing the action.
     * @return The updated booking response data.
     */
    BookingResponseDTO approveOrRejectBooking(Long bookingId, BookingStatusUpdateDTO dto, Long adminId);

    /**
     * Cancels an existing booking.
     *
     * @param bookingId The booking ID.
     * @param userId    The ID of the user requesting cancellation.
     * @param role      The role of the user.
     * @return The updated booking response data.
     */
    BookingResponseDTO cancelBooking(Long bookingId, Long userId, String role);

    /**
     * Hard deletes a booking record (Admin only).
     *
     * @param bookingId The ID of the booking to delete.
     */
    void deleteBooking(Long bookingId);
}
