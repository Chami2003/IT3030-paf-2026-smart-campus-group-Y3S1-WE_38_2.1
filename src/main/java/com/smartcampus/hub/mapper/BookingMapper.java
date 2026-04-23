package com.smartcampus.hub.mapper;

import com.smartcampus.hub.dto.BookingRequestDTO;
import com.smartcampus.hub.dto.BookingResponseDTO;
import com.smartcampus.hub.entity.Booking;
import com.smartcampus.hub.entity.BookingStatus;
import com.smartcampus.hub.entity.Resource;
import com.smartcampus.hub.entity.User;
import org.springframework.stereotype.Component;

/**
 * Mapper class for converting between Booking entities and DTOs.
 */
@Component
public class BookingMapper {

    /**
     * Converts a BookingRequestDTO to a Booking entity.
     * Note: Resource and User associations should be handled by the service layer.
     *
     * @param dto The request DTO.
     * @return A Booking entity.
     */
    public Booking toEntity(BookingRequestDTO dto) {
        if (dto == null) {
            return null;
        }

        return Booking.builder()
                .bookingDate(dto.getBookingDate())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .purpose(dto.getPurpose())
                .expectedAttendees(dto.getExpectedAttendees())
                .status(BookingStatus.PENDING) // Default status for new requests
                .build();
    }

    /**
     * Converts a Booking entity to a BookingResponseDTO.
     *
     * @param entity The Booking entity.
     * @return A response DTO.
     */
    public BookingResponseDTO toResponseDTO(Booking entity) {
        if (entity == null) {
            return null;
        }

        BookingResponseDTO.BookingResponseDTOBuilder builder = BookingResponseDTO.builder()
                .id(entity.getId())
                .bookingDate(entity.getBookingDate())
                .startTime(entity.getStartTime())
                .endTime(entity.getEndTime())
                .purpose(entity.getPurpose())
                .expectedAttendees(entity.getExpectedAttendees())
                .status(entity.getStatus() != null ? entity.getStatus().name() : null)
                .rejectionReason(entity.getRejectionReason())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt());

        // Map Resource details
        Resource resource = entity.getResource();
        if (resource != null) {
            builder.resourceId(resource.getId())
                   .resourceName(resource.getName())
                   .resourceLocation(resource.getLocation());
        }

        // Map User details
        User user = entity.getRequestedBy();
        if (user != null) {
            builder.requestedById(user.getId())
                   .requestedByName(user.getName())
                   .requestedByEmail(user.getEmail());
        }

        return builder.build();
    }
}
