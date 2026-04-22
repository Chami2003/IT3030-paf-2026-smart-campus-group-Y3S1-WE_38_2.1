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

    public Ticket createTicket(Ticket ticket) {
        // ඇමුණුම් 3කට වඩා වැඩි නම් Error එකක් පෙන්වන්න
        if (ticket.getAttachmentUrls() != null && ticket.getAttachmentUrls().size() > 3) {
            throw new RuntimeException("පින්තූර 3 කට වඩා ඇතුළත් කළ නොහැක.");
        }
        return ticketRepository.save(ticket);
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public Ticket updateTicketStatus(Long id, Ticket.Status newStatus) {
        Ticket ticket = ticketRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("ටිකට් එක සොයාගත නොහැකි විය."));
        ticket.setStatus(newStatus);
        return ticketRepository.save(ticket);
    }
}
