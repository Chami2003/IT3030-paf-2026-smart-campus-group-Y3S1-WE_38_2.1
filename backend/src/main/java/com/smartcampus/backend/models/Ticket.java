package com.smartcampus.backend.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "tickets")
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    private String title; 
    
    @NotBlank(message = "Category is required")
    private String category;
    
    @NotBlank(message = "Description is required")
    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    private Priority priority;

    @Enumerated(EnumType.STRING)
    private Status status = Status.OPEN;

    @NotBlank(message = "Location is required")
    private String location;
    
    @NotBlank(message = "Contact details are required")
    private String contactDetails;
    
    private String assignedTechnicianId;

    @Column(length = 2000)
    private String resolutionNotes;
    
    @Column(length = 1000)
    private String rejectionReason;

    @ElementCollection
    private List<String> attachmentUrls = new ArrayList<>();

    @Transient
    private boolean overdue;

    private LocalDateTime createdAt = LocalDateTime.now(); // SLA timer 
    private LocalDateTime firstRespondedAt;
    private LocalDateTime resolvedAt;

    // --- Enum Types ---
    public enum Priority { LOW, MEDIUM, HIGH }
    public enum Status { OPEN, IN_PROGRESS, RESOLVED, CLOSED, REJECTED }

    // --- Constructors ---
    public Ticket() {}

    public Ticket(Long id, String title, String category, String description, Priority priority, Status status, String location, String contactDetails, String assignedTechnicianId, String resolutionNotes, String rejectionReason, List<String> attachmentUrls, LocalDateTime createdAt, LocalDateTime firstRespondedAt, LocalDateTime resolvedAt) {
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
        this.rejectionReason = rejectionReason;
        this.attachmentUrls = attachmentUrls;
        if(createdAt != null) this.createdAt = createdAt;
        this.firstRespondedAt = firstRespondedAt;
        this.resolvedAt = resolvedAt;
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
    
    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public LocalDateTime getFirstRespondedAt() { return firstRespondedAt; }
    public void setFirstRespondedAt(LocalDateTime firstRespondedAt) { this.firstRespondedAt = firstRespondedAt; }

    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
    
    public boolean isOverdue() {
        if (this.priority == Priority.HIGH && this.status != Status.RESOLVED && this.status != Status.CLOSED && this.status != Status.REJECTED) {
            if (this.firstRespondedAt == null) {
                if (this.createdAt != null && this.createdAt.plusHours(2).isBefore(LocalDateTime.now())) {
                    return true;
                }
            }
        }
        return false;
    }
}