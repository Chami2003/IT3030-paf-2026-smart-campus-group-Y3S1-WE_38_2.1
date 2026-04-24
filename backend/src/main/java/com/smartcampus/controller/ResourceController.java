package com.smartcampus.controller;

import com.smartcampus.entity.Resource;
import com.smartcampus.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

/**
 * REST Controller for managing Facilities & Assets (Resources).
 * Provides endpoints for CRUD operations and searching resources.
 */
@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}, allowCredentials = "true")
public class ResourceController {

    @Autowired
    private ResourceRepository resourceRepository;

    /**
     * Retrieve all resources in the catalogue.
     * @return List of all resources
     */
    @GetMapping
    public ResponseEntity<List<Resource>> getAllResources() {
        return ResponseEntity.ok(resourceRepository.findAll());
    }

    /**
     * Retrieve a specific resource by its ID.
     * @param id The ID of the resource
     * @return The resource if found, or 404 Not Found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Resource> getResourceById(@PathVariable Long id) {
        Optional<Resource> resource = resourceRepository.findById(id);
        return resource.map(ResponseEntity::ok)
                       .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Search resources by type, minimum capacity, and/or location.
     * @param type Optional type filter (e.g., LECTURE_HALL)
     * @param capacity Optional minimum capacity filter
     * @param location Optional location filter
     * @return List of resources matching the criteria
     */
    @GetMapping("/search")
    public ResponseEntity<List<Resource>> searchResources(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Integer capacity,
            @RequestParam(required = false) String location) {
        return ResponseEntity.ok(resourceRepository.searchResources(type, capacity, location));
    }

    /**
     * Create a new resource in the catalogue.
     * @param resource The resource details to create
     * @return The created resource
     */
    @PostMapping
    public ResponseEntity<Resource> createResource(@Valid @RequestBody Resource resource) {
        Resource savedResource = resourceRepository.save(resource);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedResource);
    }

    /**
     * Update an existing resource.
     * @param id The ID of the resource to update
     * @param resourceDetails The updated details
     * @return The updated resource, or 404 Not Found
     */
    @PutMapping("/{id}")
    public ResponseEntity<Resource> updateResource(@PathVariable Long id, @Valid @RequestBody Resource resourceDetails) {
        Optional<Resource> optionalResource = resourceRepository.findById(id);
        
        if (!optionalResource.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        Resource existingResource = optionalResource.get();
        existingResource.setName(resourceDetails.getName());
        existingResource.setType(resourceDetails.getType());
        existingResource.setCapacity(resourceDetails.getCapacity());
        existingResource.setLocation(resourceDetails.getLocation());
        existingResource.setAvailable(resourceDetails.isAvailable());
        existingResource.setStatus(resourceDetails.getStatus());
        existingResource.setAvailabilityWindows(resourceDetails.getAvailabilityWindows());
        
        Resource updatedResource = resourceRepository.save(existingResource);
        return ResponseEntity.ok(updatedResource);
    }

    /**
     * Delete a resource from the catalogue.
     * @param id The ID of the resource to delete
     * @return 204 No Content on success, or 404 Not Found
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        if (!resourceRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        resourceRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}