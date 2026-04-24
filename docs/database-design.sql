-- Smart Campus Database Schema

-- Create Database
CREATE DATABASE IF NOT EXISTS smart_campus;
USE smart_campus;

-- Users Table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'STUDENT', 'STAFF', 'FACULTY') NOT NULL,
    phone VARCHAR(20),
    avatar_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Facilities Table
CREATE TABLE facilities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    capacity INT NOT NULL,
    facility_type ENUM('CLASSROOM', 'LABORATORY', 'AUDITORIUM', 'MEETING_ROOM', 'GYM', 'LIBRARY') NOT NULL,
    amenities JSON,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_type (facility_type),
    INDEX idx_location (location)
);

-- Bookings Table
CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    facility_id INT NOT NULL,
    user_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    reason VARCHAR(255),
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_facility (facility_id),
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_date (start_date)
);

-- Events Table
CREATE TABLE events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location VARCHAR(255),
    organizer_id INT NOT NULL,
    capacity INT,
    category VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_date (event_date),
    INDEX idx_organizer (organizer_id),
    INDEX idx_category (category)
);

-- Event Registrations Table
CREATE TABLE event_registrations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('REGISTERED', 'CANCELLED', 'ATTENDED') DEFAULT 'REGISTERED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_registration (event_id, user_id),
    INDEX idx_user (user_id),
    INDEX idx_status (status)
);

-- Resources Table
CREATE TABLE resources (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    location VARCHAR(255),
    status ENUM('AVAILABLE', 'IN_USE', 'MAINTENANCE') DEFAULT 'AVAILABLE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_status (status)
);

-- Resource Allocations Table
CREATE TABLE resource_allocations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    resource_id INT NOT NULL,
    user_id INT NOT NULL,
    allocated_quantity INT NOT NULL,
    allocation_date DATE NOT NULL,
    return_date DATE,
    purpose VARCHAR(255),
    status ENUM('ALLOCATED', 'RETURNED', 'PENDING_RETURN') DEFAULT 'ALLOCATED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_resource (resource_id)
);

-- Announcements Table
CREATE TABLE announcements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(150) NOT NULL,
    content TEXT NOT NULL,
    author_id INT NOT NULL,
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_created (created_at),
    INDEX idx_pinned (is_pinned)
);

-- Audit Logs Table
CREATE TABLE audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INT,
    changes JSON,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_created (created_at)
);

-- Create Indexes for Performance
CREATE INDEX idx_booking_dates ON bookings(start_date, end_date);
CREATE INDEX idx_event_dates ON events(event_date);
CREATE INDEX idx_resource_status ON resources(status);

-- Insert Sample Data (Optional)

-- Sample Users
INSERT INTO users (name, email, password, role, phone) VALUES
('Admin ', 'admin@smartcampus.edu', 'hashed_password', 'ADMIN', '555-0001'),
('Chamidu Himahansa', 'chamidu@smartcampus.edu', 'hashed_password', 'STUDENT', '555-0002'),
('Gimahan', 'gimhan@smartcampus.edu', 'hashed_password', 'FACULTY', '555-0003');

-- Sample Facilities
INSERT INTO facilities (name, description, location, capacity, facility_type, amenities) VALUES
('Computer Lab 1', 'Advanced computing facility', 'Building A, Floor 2', 30, 'LABORATORY', '["Projector", "WIFI", "Whiteboard"]'),
('Auditorium', 'Main campus auditorium', 'Central Building', 500, 'AUDITORIUM', '["Projector", "Sound System", "Stage"]'),
('Meeting Room 101', 'Conference room for meetings', 'Building B, Floor 1', 20, 'MEETING_ROOM', '["Table", "Chairs", "Projector"]');

-- Sample Events
INSERT INTO events (title, description, event_date, start_time, end_time, location, organizer_id, capacity, category) VALUES
('Tech Workshop', 'Introduction to Cloud Computing', '2026-04-25', '10:00', '12:00', 'Lab 1', 1, 50, 'WORKSHOP'),
('Annual Conference', 'Campus Annual Academic Conference', '2026-05-01', '09:00', '17:00', 'Auditorium', 2, 300, 'CONFERENCE');
