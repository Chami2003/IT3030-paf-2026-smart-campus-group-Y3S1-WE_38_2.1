package com.smartcampus.backend.controllers;

import com.smartcampus.backend.models.Ticket;
import com.smartcampus.backend.models.TicketHistory;
import com.smartcampus.backend.services.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.Valid;
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
    public ResponseEntity<Ticket> create(
        @Valid @RequestPart("ticket") Ticket ticket, 
        @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) {
        Ticket createdTicket = ticketService.createTicket(ticket, images);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTicket);
    }

    // 2. Get All Tickets (GET)
    @GetMapping
    public ResponseEntity<List<Ticket>> getAll() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }
    
    // Get ticket by ID
    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getAllTickets().stream()
            .filter(t -> t.getId().equals(id))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Ticket not found")));
    }
    
    // Get Ticket History
    @GetMapping("/{id}/history")
    public ResponseEntity<List<TicketHistory>> getTicketHistory(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getTicketHistory(id));
    }

    // 3. Update Ticket - Technician Updates (PUT)
    @PutMapping("/{id}")
    public ResponseEntity<Ticket> updateTicket(@PathVariable Long id, @Valid @RequestBody Ticket ticketDetails) {
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
    public ResponseEntity<Ticket> updateStatus(@PathVariable Long id, @RequestParam Ticket.Status status) {
        return ResponseEntity.ok(ticketService.updateTicketStatus(id, status));
    }
}