package com.smartcampus.hub.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.AssertTrue;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Data Transfer Object for creating a new booking request.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequestDTO {

    @NotNull(message = "Resource ID is required")
    private Long resourceId;

    @NotNull(message = "Booking date is required")
    @Future(message = "Booking date must be in the future")
    private LocalDate bookingDate;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    private LocalTime endTime;

    @NotBlank(message = "Purpose is required")
    private String purpose;

    private Integer expectedAttendees;

    /**
     * Validates that the end time is after the start time.
     * 
     * @return true if valid, false otherwise.
     */
    @AssertTrue(message = "End time must be after start time")
    private boolean isTimeRangeValid() {
        if (startTime == null || endTime == null) {
            return true; // Handled by @NotNull
        }
        return endTime.isAfter(startTime);
    }
}
