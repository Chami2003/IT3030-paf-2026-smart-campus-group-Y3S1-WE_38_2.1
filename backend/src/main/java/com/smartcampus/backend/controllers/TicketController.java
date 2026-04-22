package com.smartcampus.backend.controllers;

import com.smartcampus.backend.models.Ticket;
import com.smartcampus.backend.services.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    // 1. Create Ticket (POST)
    @PostMapping
    public Ticket create(@RequestBody Ticket ticket) {
        return ticketService.createTicket(ticket);
    }

    // 2. Get All Tickets (GET)
    @GetMapping
    public List<Ticket> getAll() {
        return ticketService.getAllTickets();
    }

    // 3. Update Ticket - Technician Updates (PUT)
    // මේකෙන් status, resolution notes සහ technician id ඔක්කොම update කරන්න පුළුවන්
    @PutMapping("/{id}")
    public ResponseEntity<Ticket> updateTicket(@PathVariable Long id, @RequestBody Ticket ticketDetails) {
        Ticket updatedTicket = ticketService.updateTicketDetails(id, ticketDetails);
        return ResponseEntity.ok(updatedTicket);
    }

    // 4. Delete Ticket (DELETE) - Assignment requirement එකක්
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }
    
    // අවශ්‍ය නම් Status එක විතරක් update කරන්නත් පුළුවන් (Optional)
    @PatchMapping("/{id}/status")
    public Ticket updateStatus(@PathVariable Long id, @RequestParam Ticket.Status status) {
        return ticketService.updateTicketStatus(id, status);
    }
}