package com.smartcampus.hub.repository;

import com.smartcampus.hub.entity.Booking;
import com.smartcampus.hub.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/**
 * Repository interface for {@link Booking} entity.
 */
@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    /**
     * Finds all bookings requested by a specific user.
     *
     * @param userId The ID of the user who requested the booking.
     * @return List of bookings.
     */
    List<Booking> findByRequestedBy_Id(Long userId);

    /**
     * Finds all bookings with a specific status.
     *
     * @param status The booking status (PENDING, APPROVED, etc.).
     * @return List of bookings.
     */
    List<Booking> findByStatus(BookingStatus status);

    /**
     * Finds all bookings for a specific resource with a specific status.
     *
     * @param resourceId The ID of the resource.
     * @param status     The booking status.
     * @return List of bookings.
     */
    List<Booking> findByResource_IdAndStatus(Long resourceId, BookingStatus status);

    /**
     * Detects potential booking conflicts.
     * Searches for APPROVED bookings for the same resource on the same date where time slots overlap.
     *
     * @param resourceId  The ID of the resource to check.
     * @param bookingDate The date of the new booking.
     * @param startTime   The start time of the new booking.
     * @param endTime     The end time of the new booking.
     * @return List of conflicting bookings.
     */
    @Query("SELECT b FROM Booking b WHERE b.resource.id = :resourceId " +
            "AND b.bookingDate = :bookingDate " +
            "AND b.status = 'APPROVED' " +
            "AND b.startTime < :endTime " +
            "AND b.endTime > :startTime")
    List<Booking> findConflictingBookings(
            @Param("resourceId") Long resourceId,
            @Param("bookingDate") LocalDate bookingDate,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );

    /**
     * Finds bookings with optional filters for resource, status, and date.
     *
     * @param resourceId  (Optional) The ID of the resource.
     * @param status      (Optional) The booking status.
     * @param bookingDate (Optional) The date of the booking.
     * @return List of bookings matching the provided filters.
     */
    @Query("SELECT b FROM Booking b WHERE " +
            "(:resourceId IS NULL OR b.resource.id = :resourceId) AND " +
            "(:status IS NULL OR b.status = :status) AND " +
            "(:bookingDate IS NULL OR b.bookingDate = :bookingDate)")
    List<Booking> findWithOptionalFilters(
            @Param("resourceId") Long resourceId,
            @Param("status") BookingStatus status,
            @Param("bookingDate") LocalDate bookingDate
    );
}
