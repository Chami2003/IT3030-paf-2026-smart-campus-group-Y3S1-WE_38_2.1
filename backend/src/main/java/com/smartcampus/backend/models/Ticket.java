package com.smartcampus.backend.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "tickets")
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title; // අලුතින් එකතු කළා
    private String category;
    
    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    private Priority priority;

    @Enumerated(EnumType.STRING)
    private Status status = Status.OPEN;

    private String location;
    private String contactDetails;
    private String assignedTechnicianId;

    @Column(length = 2000)
    private String resolutionNotes;

    @ElementCollection
    private List<String> attachmentUrls = new ArrayList<>();

    private LocalDateTime createdAt = LocalDateTime.now(); // SLA timer එකට අවශ්‍යයි

    // --- Enum Types ---
    public enum Priority { LOW, MEDIUM, HIGH }
    public enum Status { OPEN, IN_PROGRESS, RESOLVED, CLOSED, REJECTED }

    // --- Constructors ---
    public Ticket() {}

    public Ticket(Long id, String title, String category, String description, Priority priority, Status status, String location, String contactDetails, String assignedTechnicianId, String resolutionNotes, List<String> attachmentUrls) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.description = description;
        this.priority = priority;
        this.status = status;
        this.location = location;
        this.contactDetails = contactDetails;
        this.assignedTechnicianId = assignedTechnicianId;
        this.resolutionNotes = resolutionNotes;
        this.attachmentUrls = attachmentUrls;
    }

    // --- Getters and Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getContactDetails() { return contactDetails; }
    public void setContactDetails(String contactDetails) { this.contactDetails = contactDetails; }

    public String getAssignedTechnicianId() { return assignedTechnicianId; }
    public void setAssignedTechnicianId(String assignedTechnicianId) { this.assignedTechnicianId = assignedTechnicianId; }

    public String getResolutionNotes() { return resolutionNotes; }
    public void setResolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; }

    public List<String> getAttachmentUrls() { return attachmentUrls; }
    public void setAttachmentUrls(List<String> attachmentUrls) { this.attachmentUrls = attachmentUrls; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}