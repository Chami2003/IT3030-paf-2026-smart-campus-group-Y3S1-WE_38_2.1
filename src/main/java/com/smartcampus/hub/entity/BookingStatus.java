package com.smartcampus.hub.entity;

/**
 * Represents the status of a resource booking.
 */
public enum BookingStatus {
    /**
     * Booking is awaiting approval.
     */
    PENDING,

    /**
     * Booking has been approved and the resource is reserved.
     */
    APPROVED,

    /**
     * Booking request has been rejected by an administrator.
     */
    REJECTED,

    /**
     * Booking has been cancelled by the requester or system.
     */
    CANCELLED
}
