package com.smartcampus.backend.controllers;

import com.smartcampus.backend.models.Ticket;
import com.smartcampus.backend.services.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    // 1. Create Ticket with Images (POST)
    // Consumes multipart/form-data භාවිතා කර පින්තූර සහ දත්ත භාර ගනී
    @PostMapping(consumes = {"multipart/form-data"})
    public Ticket create(
        @RequestPart("ticket") Ticket ticket, 
        @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) {
        return ticketService.createTicket(ticket, images);
    }

    // 2. Get All Tickets (GET)
    @GetMapping
    public List<Ticket> getAll() {
        return ticketService.getAllTickets();
    }

    // 3. Update Ticket - Technician Updates (PUT)
    @PutMapping("/{id}")
    public ResponseEntity<Ticket> updateTicket(@PathVariable Long id, @RequestBody Ticket ticketDetails) {
        Ticket updatedTicket = ticketService.updateTicketDetails(id, ticketDetails);
        return ResponseEntity.ok(updatedTicket);
    }

    // 4. Delete Ticket (DELETE)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }
    
    // Optional: Update Status Only
    @PatchMapping("/{id}/status")
    public Ticket updateStatus(@PathVariable Long id, @RequestParam Ticket.Status status) {
        return ticketService.updateTicketStatus(id, status);
    }
}