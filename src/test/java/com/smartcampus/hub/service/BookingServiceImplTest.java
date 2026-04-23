package com.smartcampus.hub.service;

import com.smartcampus.hub.dto.BookingRequestDTO;
import com.smartcampus.hub.dto.BookingResponseDTO;
import com.smartcampus.hub.dto.BookingStatusUpdateDTO;
import com.smartcampus.hub.entity.Booking;
import com.smartcampus.hub.entity.BookingStatus;
import com.smartcampus.hub.entity.Resource;
import com.smartcampus.hub.entity.User;
import com.smartcampus.hub.exception.BookingConflictException;
import com.smartcampus.hub.exception.BookingNotFoundException;
import com.smartcampus.hub.exception.InvalidBookingStateException;
import com.smartcampus.hub.exception.ResourceNotFoundException;
import com.smartcampus.hub.mapper.BookingMapper;
import com.smartcampus.hub.repository.BookingRepository;
import com.smartcampus.hub.repository.ResourceRepository;
import com.smartcampus.hub.repository.UserRepository;
import com.smartcampus.hub.service.impl.BookingServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceImplTest {

    @Mock
    private BookingRepository bookingRepository;
    @Mock
    private ResourceRepository resourceRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private BookingMapper bookingMapper;

    @InjectMocks
    private BookingServiceImpl bookingService;

    private Resource activeResource;
    private User testUser;
    private BookingRequestDTO validRequest;

    @BeforeEach
    void setUp() {
        activeResource = Resource.builder()
                .id(1L)
                .name("Room A")
                .status("ACTIVE")
                .build();

        testUser = User.builder()
                .id(101L)
                .name("John Doe")
                .email("john@example.com")
                .build();

        validRequest = BookingRequestDTO.builder()
                .resourceId(1L)
                .bookingDate(LocalDate.now().plusDays(1))
                .startTime(LocalTime.of(10, 0))
                .endTime(LocalTime.of(12, 0))
                .purpose("Meeting")
                .build();
    }

    @Test
    void createBooking_Success() {
        // Arrange
        when(resourceRepository.findById(1L)).thenReturn(Optional.of(activeResource));
        when(userRepository.findById(101L)).thenReturn(Optional.of(testUser));
        when(bookingRepository.findConflictingBookings(any(), any(), any(), any())).thenReturn(List.of());
        
        Booking bookingEntity = new Booking();
        when(bookingMapper.toEntity(any())).thenReturn(bookingEntity);
        when(bookingRepository.save(any())).thenReturn(bookingEntity);
        when(bookingMapper.toResponseDTO(any())).thenReturn(new BookingResponseDTO());

        // Act
        BookingResponseDTO response = bookingService.createBooking(validRequest, 101L);

        // Assert
        assertThat(response).isNotNull();
        verify(bookingRepository).save(any());
    }

    @Test
    void createBooking_ResourceNotFound_ThrowsException() {
        when(resourceRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> bookingService.createBooking(validRequest, 101L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void createBooking_ResourceOutOfService_ThrowsException() {
        activeResource.setStatus("OUT_OF_SERVICE");
        when(resourceRepository.findById(1L)).thenReturn(Optional.of(activeResource));

        assertThatThrownBy(() -> bookingService.createBooking(validRequest, 101L))
                .isInstanceOf(IllegalStateException.class);
    }

    @Test
    void createBooking_ConflictDetected_ThrowsException() {
        when(resourceRepository.findById(1L)).thenReturn(Optional.of(activeResource));
        when(userRepository.findById(101L)).thenReturn(Optional.of(testUser));
        when(bookingRepository.findConflictingBookings(any(), any(), any(), any()))
                .thenReturn(List.of(new Booking()));

        assertThatThrownBy(() -> bookingService.createBooking(validRequest, 101L))
                .isInstanceOf(BookingConflictException.class);
    }

    @Test
    void approveBooking_Success() {
        Booking pendingBooking = Booking.builder()
                .id(50L)
                .status(BookingStatus.PENDING)
                .build();
        
        BookingStatusUpdateDTO updateDto = BookingStatusUpdateDTO.builder()
                .status(BookingStatus.APPROVED)
                .build();

        when(bookingRepository.findById(50L)).thenReturn(Optional.of(pendingBooking));
        when(bookingRepository.save(any())).thenReturn(pendingBooking);
        when(bookingMapper.toResponseDTO(any())).thenReturn(new BookingResponseDTO());

        BookingResponseDTO response = bookingService.approveOrRejectBooking(50L, updateDto, 999L);

        assertThat(response).isNotNull();
        assertThat(pendingBooking.getStatus()).isEqualTo(BookingStatus.APPROVED);
    }

    @Test
    void rejectBooking_Success() {
        Booking pendingBooking = Booking.builder()
                .id(50L)
                .status(BookingStatus.PENDING)
                .build();
        
        BookingStatusUpdateDTO updateDto = BookingStatusUpdateDTO.builder()
                .status(BookingStatus.REJECTED)
                .rejectionReason("Incomplete details")
                .build();

        when(bookingRepository.findById(50L)).thenReturn(Optional.of(pendingBooking));
        when(bookingRepository.save(any())).thenReturn(pendingBooking);
        when(bookingMapper.toResponseDTO(any())).thenReturn(new BookingResponseDTO());

        bookingService.approveOrRejectBooking(50L, updateDto, 999L);

        assertThat(pendingBooking.getStatus()).isEqualTo(BookingStatus.REJECTED);
        assertThat(pendingBooking.getRejectionReason()).isEqualTo("Incomplete details");
    }

    @Test
    void updateStatus_NotPending_ThrowsException() {
        Booking approvedBooking = Booking.builder()
                .id(50L)
                .status(BookingStatus.APPROVED)
                .build();
        
        when(bookingRepository.findById(50L)).thenReturn(Optional.of(approvedBooking));

        assertThatThrownBy(() -> bookingService.approveOrRejectBooking(50L, new BookingStatusUpdateDTO(), 999L))
                .isInstanceOf(InvalidBookingStateException.class);
    }

    @Test
    void cancelBooking_Owner_Success() {
        Booking booking = Booking.builder()
                .id(50L)
                .status(BookingStatus.APPROVED)
                .requestedBy(testUser)
                .build();

        when(bookingRepository.findById(50L)).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any())).thenReturn(booking);
        when(bookingMapper.toResponseDTO(any())).thenReturn(new BookingResponseDTO());

        bookingService.cancelBooking(50L, 101L, "USER");

        assertThat(booking.getStatus()).isEqualTo(BookingStatus.CANCELLED);
    }

    @Test
    void cancelBooking_Admin_Success() {
        Booking booking = Booking.builder()
                .id(50L)
                .status(BookingStatus.APPROVED)
                .requestedBy(testUser)
                .build();

        when(bookingRepository.findById(50L)).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any())).thenReturn(booking);
        when(bookingMapper.toResponseDTO(any())).thenReturn(new BookingResponseDTO());

        bookingService.cancelBooking(50L, 999L, "ADMIN");

        assertThat(booking.getStatus()).isEqualTo(BookingStatus.CANCELLED);
    }

    @Test
    void cancelBooking_Rejected_ThrowsException() {
        Booking rejectedBooking = Booking.builder()
                .id(50L)
                .status(BookingStatus.REJECTED)
                .requestedBy(testUser)
                .build();

        when(bookingRepository.findById(50L)).thenReturn(Optional.of(rejectedBooking));

        assertThatThrownBy(() -> bookingService.cancelBooking(50L, 101L, "USER"))
                .isInstanceOf(InvalidBookingStateException.class);
    }

    @Test
    void getUserBookings_ReturnsList() {
        when(bookingRepository.findByRequestedBy_Id(101L)).thenReturn(List.of(new Booking(), new Booking()));
        when(bookingMapper.toResponseDTO(any())).thenReturn(new BookingResponseDTO());

        List<BookingResponseDTO> result = bookingService.getUserBookings(101L);

        assertThat(result).hasSize(2);
    }
}
