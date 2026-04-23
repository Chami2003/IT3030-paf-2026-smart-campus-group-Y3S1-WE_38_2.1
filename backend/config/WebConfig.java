package com.smartcampus.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // වර්තමාන project directory එක ලබා ගැනීම
        String userDir = System.getProperty("user.dir");
        
        // uploads folder එක සඳහා සම්පූර්ණ පථය (Absolute Path) සැකසීම
        String uploadPath = "file:" + userDir + File.separator + "uploads" + File.separator;

        // Frontend එකෙන් /uploads/** ලෙස එන requests, භෞතිකව ඇති uploads folder එකට යොමු කිරීම
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadPath);
    }
}