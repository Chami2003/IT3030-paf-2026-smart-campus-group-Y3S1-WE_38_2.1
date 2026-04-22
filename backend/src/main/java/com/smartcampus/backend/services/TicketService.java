package com.smartcampus.backend.services;

import com.smartcampus.backend.models.Ticket;
import com.smartcampus.backend.repositories.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    // 1. Create Ticket with Image Validation
    public Ticket createTicket(Ticket ticket) {
        // Requirement: පින්තූර 3කට වඩා වැඩි නම් Error එකක් පෙන්වීම
        if (ticket.getAttachmentUrls() != null && ticket.getAttachmentUrls().size() > 3) {
            throw new RuntimeException("Maximum 3 attachments allowed.");
        }
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

        // Technician කෙනෙකුට අවශ්‍ය ප්‍රධාන updates මෙහිදී සිදුවේ
        ticket.setStatus(ticketDetails.getStatus());
        ticket.setResolutionNotes(ticketDetails.getResolutionNotes());
        ticket.setAssignedTechnicianId(ticketDetails.getAssignedTechnicianId());
        
        // අමතරව වෙනස් වූ Category හෝ Priority තිබේ නම් ඒවාද update වේ
        if(ticketDetails.getCategory() != null) ticket.setCategory(ticketDetails.getCategory());
        if(ticketDetails.getPriority() != null) ticket.setPriority(ticketDetails.getPriority());

        return ticketRepository.save(ticket);
    }

    // 4. Delete Ticket (Requirement: Endpoint 4ක් සම්පූර්ණ කිරීමට)
    public void deleteTicket(Long id) {
        Ticket ticket = ticketRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + id));
        ticketRepository.delete(ticket);
    }

    // 5. Update Status Only (Option for simple updates)
    public Ticket updateTicketStatus(Long id, Ticket.Status newStatus) {
        Ticket ticket = ticketRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Ticket not found."));
        ticket.setStatus(newStatus);
        return ticketRepository.save(ticket);
    }
}