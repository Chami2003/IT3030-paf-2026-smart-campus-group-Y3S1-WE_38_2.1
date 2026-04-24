package com.smartcampus.backend.repositories;

import com.smartcampus.backend.models.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    // basic Database (Save, Delete, Find) JpaRepository 
}
