package com.smartcampus.service;

import com.smartcampus.entity.Notification;
import com.smartcampus.entity.User;
import com.smartcampus.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.logging.Logger;

@Service
public class NotificationService {
    private static final Logger logger = Logger.getLogger(NotificationService.class.getName());

    @Autowired
    private NotificationRepository notificationRepository;

    public void sendNotification(User user, String message) {
        Notification notification = Notification.builder()
                .user(user)
                .message(message)
                .createdAt(LocalDateTime.now())
                .isRead(false)
                .build();

        notificationRepository.save(notification);
        logger.info("Saved notification for user " + user.getEmail() + ": " + message);
    }
}
