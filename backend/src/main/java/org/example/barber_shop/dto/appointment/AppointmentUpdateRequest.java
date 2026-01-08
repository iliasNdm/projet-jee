package org.example.barber_shop.dto.appointment;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AppointmentUpdateRequest {

    @NotNull(message = "New time must be provided.")
    @Future(message = "New time must be in the future.")
    private LocalDateTime newDateTime;
}
