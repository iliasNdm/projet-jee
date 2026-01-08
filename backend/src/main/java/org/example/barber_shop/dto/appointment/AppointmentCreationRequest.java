package org.example.barber_shop.dto.appointment;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class AppointmentCreationRequest {

    @NotNull(message = "Select a barber")
    private Long barberId;

    @NotNull(message = "Select a valid time")
    @Future(message = "Select a valid time")
    private LocalDateTime dateTime;

    @NotNull(message = "Select at least one service")
    private List<Long> serviceIds;
}
