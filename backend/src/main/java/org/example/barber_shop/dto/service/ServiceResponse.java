package org.example.barber_shop.dto.service;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@lombok.NoArgsConstructor
public class ServiceResponse {
    private Long id;
    private String name;
    // private String description;
    private Integer durationMinutes;
    private Double price;
}
