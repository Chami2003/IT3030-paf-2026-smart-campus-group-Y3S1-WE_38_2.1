package com.smartcampus.hub.exception;

/**
 * Exception thrown when an illegal status transition is attempted on a booking.
 */
public class InvalidBookingStateException extends RuntimeException {
    public InvalidBookingStateException(String message) {
        super(message);
    }
}
