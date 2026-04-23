package com.smartcampus.hub.repository;

import com.smartcampus.hub.entity.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for {@link Resource} entity.
 */
@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {
}
