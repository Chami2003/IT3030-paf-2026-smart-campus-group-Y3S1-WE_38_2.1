package com.smartcampus.controller;

import com.smartcampus.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @PostMapping("/send")
    public ResponseEntity<String> sendNotification(@RequestParam String userId, @RequestParam String message) {
        notificationService.sendNotification(userId, message);
        return ResponseEntity.ok("Notification sent successfully");
    }
}
