package com.smartcampus.repositories;

import com.smartcampus.models.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Resource entity.
 * Provides basic CRUD operations and custom search methods.
 */
@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {

    /**
     * Searches for resources based on optional filters.
     * 
     * @param type The type of resource (e.g., LECTURE_HALL, LAB)
     * @param capacity The minimum capacity required
     * @param location The location or part of the location name
     * @return List of matching resources
     */
    @Query("SELECT r FROM Resource r WHERE " +
           "(:type IS NULL OR LOWER(r.type) LIKE LOWER(CONCAT('%', :type, '%'))) AND " +
           "(:capacity IS NULL OR r.capacity >= :capacity) AND " +
           "(:location IS NULL OR LOWER(r.location) LIKE LOWER(CONCAT('%', :location, '%')))")
    List<Resource> searchResources(@Param("type") String type, 
                                   @Param("capacity") Integer capacity, 
                                   @Param("location") String location);
}