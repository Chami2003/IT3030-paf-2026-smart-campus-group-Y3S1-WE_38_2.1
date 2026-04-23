package com.smartcampus.hub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * Data Transfer Object for filtering booking records.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingFilterDTO {
    private Long resourceId;
    private String status;
    private LocalDate bookingDate;
}
