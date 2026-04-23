package com.smartcampus.hub.exception;

/**
 * Exception thrown when a requested booking record is not found.
 */
public class BookingNotFoundException extends RuntimeException {
    public BookingNotFoundException(String message) {
        super(message);
    }
}
