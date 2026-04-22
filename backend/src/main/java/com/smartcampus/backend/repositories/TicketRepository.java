package com.smartcampus.backend.repositories;

import com.smartcampus.backend.models.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    // මූලික Database වැඩ (Save, Delete, Find) ඔක්කොම JpaRepository එකෙන් ලැබෙනවා.
}