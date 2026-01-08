package org.example.barber_shop.dto.barber;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class BarberInternalDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private double salary;
    private LocalDateTime hireDate;
    private Integer totalAppointments; // calculate totalAppointments from appointments.size()
}
