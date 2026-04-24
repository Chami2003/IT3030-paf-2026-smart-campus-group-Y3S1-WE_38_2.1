package com.smartcampus.service;

import org.springframework.stereotype.Service;
import java.util.logging.Logger;

@Service
public class NotificationService {
    private static final Logger logger = Logger.getLogger(NotificationService.class.getName());

    public void sendNotification(String userId, String message) {
        // Implementation for sending notifications (Email/Push/SMS)
        logger.info("Sending notification to " + userId + ": " + message);
    }
}
