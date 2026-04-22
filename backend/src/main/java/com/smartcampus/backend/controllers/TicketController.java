package com.smartcampus.backend.controllers;

import com.smartcampus.backend.models.Ticket;
import com.smartcampus.backend.services.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "http://localhost:3000") // React port එක
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @PostMapping
    public Ticket create(@RequestBody Ticket ticket) {
        return ticketService.createTicket(ticket);
    }

    @GetMapping
    public List<Ticket> getAll() {
        return ticketService.getAllTickets();
    }

    @PutMapping("/{id}/status")
    public Ticket updateStatus(@PathVariable Long id, @RequestParam Ticket.Status status) {
        return ticketService.updateTicketStatus(id, status);
    }
}