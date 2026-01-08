package org.example.barber_shop.service_layer.appointment;

import org.example.barber_shop.dto.appointment.AppointmentCreationRequest;
import org.example.barber_shop.dto.appointment.AppointmentResponse;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentManager {
    AppointmentResponse getAppointmentDetails(Long appointmentId);
    AppointmentResponse bookAppointment(AppointmentCreationRequest appointmentCreationRequest,
                                               Long userId);
    Boolean cancelAppointment(Long appointmentId, Long clientId);
    List<AppointmentResponse> findAppointmentByBarberId(Long barberId);
    AppointmentResponse updateAppointmentTime(Long appointmentId ,LocalDateTime newDateTime, Long clientId);
    List<AppointmentResponse> findMyAppointments(Long clientId);

}
