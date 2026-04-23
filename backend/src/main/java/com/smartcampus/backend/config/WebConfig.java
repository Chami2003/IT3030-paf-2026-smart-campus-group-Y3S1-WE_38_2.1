package com.smartcampus.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path projectRoot = Paths.get(".").toAbsolutePath().normalize();
        Path uploadPath = projectRoot.resolve("uploads").normalize();

        if (!Files.exists(uploadPath)) {
            uploadPath = projectRoot.resolve("backend").resolve("uploads").normalize();
        }

        String uploadLocation = uploadPath.toUri().toString();
        if (!uploadLocation.endsWith("/")) {
            uploadLocation += "/";
        }
        System.out.println("[WebConfig] uploadLocation=" + uploadLocation);

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadLocation)
                .setCachePeriod(0);
    }
}
