package org.example.barber_shop.dto.service;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ServiceCreationRequest {
    @NotBlank(message = "Service name is required.")
    private String name;
//    @NotBlank(message = "Description is required.")
//    private String description;
    @NotNull(message = "Duration is required.")
    @Min(value = 15, message = "Duration must be at least 15 minutes.")
    private Integer durationMinutes;
    @NotNull(message = "Price is required.")
    @Min(value = 0, message = "Price cannot be negative.")
    private Double price;
}
