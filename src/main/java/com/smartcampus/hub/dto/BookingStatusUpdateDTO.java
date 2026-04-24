package com.smartcampus.hub.dto;

import com.smartcampus.hub.entity.BookingStatus;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for updating a booking's status (Approve/Reject).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingStatusUpdateDTO {

    @NotNull(message = "Status is required")
    private BookingStatus status;

    private String rejectionReason;

    /**
     * Validates that a rejection reason is provided when the status is REJECTED.
     * 
     * @return true if valid, false otherwise.
     */
    @AssertTrue(message = "Rejection reason is required when status is REJECTED")
    private boolean isRejectionReasonValid() {
        if (BookingStatus.REJECTED.equals(status)) {
            return rejectionReason != null && !rejectionReason.trim().isEmpty();
        }
        return true;
    }
}
