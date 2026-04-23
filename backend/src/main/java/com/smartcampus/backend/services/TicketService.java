package com.smartcampus.backend.services;

import com.smartcampus.backend.models.Ticket;
import com.smartcampus.backend.repositories.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    // 1. Create Ticket with Real Image Upload
    public Ticket createTicket(Ticket ticket, List<MultipartFile> images) {
        // Requirement: පින්තූර 3කට වඩා වැඩි නම් වැළැක්වීම
        if (images != null && images.size() > 3) {
            throw new RuntimeException("Maximum 3 attachments allowed.");
        }

        List<String> savedImageUrls = new ArrayList<>();

        if (images != null && !images.isEmpty()) {
            String uploadDir = "uploads/"; 
            try {
                // Folder එක නැත්නම් අලුතින් හදනවා
                Files.createDirectories(Paths.get(uploadDir));
                
                for (MultipartFile image : images) {
                    if (!image.isEmpty()) {
                        // පින්තූරයට unique නමක් ලබා දීම (එකම නම තියෙන ඒවා replace වීම වැළැක්වීමට)
                        String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
                        Path filePath = Paths.get(uploadDir + fileName);
                        
                        // පින්තූරය server එකේ save කිරීම
                        Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                        
                        // Database එකට ලින්ක් එක එකතු කිරීම
                        savedImageUrls.add("/uploads/" + fileName);
                    }
                }
            } catch (Exception e) {
                throw new RuntimeException("Could not store images. Error: " + e.getMessage());
            }
        }

        ticket.setAttachmentUrls(savedImageUrls);
        return ticketRepository.save(ticket);
    }

    // 2. Get All Tickets
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    // 3. Update Full Ticket Details (Technician Updates)
    public Ticket updateTicketDetails(Long id, Ticket ticketDetails) {
        Ticket ticket = ticketRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + id));

        ticket.setStatus(ticketDetails.getStatus());
        ticket.setResolutionNotes(ticketDetails.getResolutionNotes());
        ticket.setAssignedTechnicianId(ticketDetails.getAssignedTechnicianId());
        
        if(ticketDetails.getCategory() != null) ticket.setCategory(ticketDetails.getCategory());
        if(ticketDetails.getPriority() != null) ticket.setPriority(ticketDetails.getPriority());

        return ticketRepository.save(ticket);
    }

    // 4. Delete Ticket
    public void deleteTicket(Long id) {
        Ticket ticket = ticketRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + id));
        ticketRepository.delete(ticket);
    }

    // 5. Update Status Only
    public Ticket updateTicketStatus(Long id, Ticket.Status newStatus) {
        Ticket ticket = ticketRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Ticket not found."));
        ticket.setStatus(newStatus);
        return ticketRepository.save(ticket);
    }
}