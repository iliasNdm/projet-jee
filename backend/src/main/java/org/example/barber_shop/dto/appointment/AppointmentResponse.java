package org.example.barber_shop.dto.appointment;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.example.barber_shop.dao.entities.AppointmentStatus;
import org.example.barber_shop.dto.service.ServiceResponse;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class AppointmentResponse {
    Long appointmentId;
    LocalDateTime dateTime;
//    LocalDateTime endTime;
    AppointmentStatus status;
    String barberName;
    List<ServiceResponse> services;
}
