package com.smartcampus.hub.repository;

import com.smartcampus.hub.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for {@link User} entity.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
}
