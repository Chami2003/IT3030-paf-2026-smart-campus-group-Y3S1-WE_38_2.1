package com.smartcampus.hub.exception;

/**
 * Exception thrown when a booking request conflicts with an existing approved booking.
 */
public class BookingConflictException extends RuntimeException {
    public BookingConflictException(String message) {
        super(message);
    }
}

/**
 * Exception thrown when a requested booking record is not found.
 */
class BookingNotFoundException extends RuntimeException {
    public BookingNotFoundException(String message) {
        super(message);
    }
}

/**
 * Exception thrown when an illegal status transition is attempted on a booking.
 */
class InvalidBookingStateException extends RuntimeException {
    public InvalidBookingStateException(String message) {
        super(message);
    }
}

/**
 * Exception thrown when a requested resource is not found.
 */
class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
