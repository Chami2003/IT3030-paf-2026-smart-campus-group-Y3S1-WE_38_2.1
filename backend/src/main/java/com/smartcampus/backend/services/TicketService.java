package com.smartcampus.backend.services;

import com.smartcampus.backend.models.Ticket;
import com.smartcampus.backend.repositories.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    public Ticket createTicket(Ticket ticket, List<MultipartFile> images) {
        if (images != null && images.size() > 3) {
            throw new RuntimeException("Maximum 3 attachments allowed.");
        }

        List<String> savedImageUrls = new ArrayList<>();

        if (images != null && !images.isEmpty()) {
            Path uploadPath = Paths.get("uploads").toAbsolutePath().normalize();
            if (!Files.exists(uploadPath)) {
                uploadPath = Paths.get("backend", "uploads").toAbsolutePath().normalize();
            }

            try {
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                for (MultipartFile image : images) {
                    if (!image.isEmpty()) {
                        String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
                        Path filePath = uploadPath.resolve(fileName);
                        Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                        savedImageUrls.add("/uploads/" + fileName);
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
                throw new RuntimeException("Could not store images. Error: " + e.getMessage());
            }
        }

        ticket.setAttachmentUrls(savedImageUrls);
        return ticketRepository.save(ticket);
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

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

    public void deleteTicket(Long id) {
        Ticket ticket = ticketRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + id));
        ticketRepository.delete(ticket);
    }

    public Ticket updateTicketStatus(Long id, Ticket.Status newStatus) {
        Ticket ticket = ticketRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Ticket not found."));
        ticket.setStatus(newStatus);
        return ticketRepository.save(ticket);
    }
}