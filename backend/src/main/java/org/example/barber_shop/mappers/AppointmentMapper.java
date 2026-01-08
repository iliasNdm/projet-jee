package org.example.barber_shop.mappers;

import org.example.barber_shop.dao.entities.Appointment;
import org.example.barber_shop.dao.entities.AppointmentService;
import org.example.barber_shop.dao.entities.Barber;
import org.example.barber_shop.dao.entities.User;
import org.example.barber_shop.dto.appointment.AppointmentCreationRequest;
import org.example.barber_shop.dto.appointment.AppointmentResponse;
import org.example.barber_shop.dto.service.ServiceResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class AppointmentMapper {

    private final ServiceMapper serviceMapper;

    @Autowired
    public AppointmentMapper(ServiceMapper serviceMapper) {
        this.serviceMapper = serviceMapper;
    }

    public AppointmentResponse toResponse(Appointment appointment) {
        if (appointment == null) {
            return null;
        }

        List<ServiceResponse> services = appointment.getServices().stream()
                .map(AppointmentService::getService)
                .map(serviceMapper::toResponse)
                .collect(Collectors.toList());

        String barberName = "";
        if (appointment.getBarber() != null && appointment.getBarber().getUser() != null) {
            barberName = appointment.getBarber().getUser().getFirstName() + " "
                    + appointment.getBarber().getUser().getLastName();
        }

        return new AppointmentResponse(
                appointment.getId(),
                appointment.getStartTime(), // Using startTime as dateTime
                appointment.getStatus(),
                barberName,
                services);
    }

    public Appointment toEntity(AppointmentCreationRequest request, User client, Barber barber) {
        if (request == null) {
            return null;
        }
        Appointment appointment = new Appointment();
        appointment.setStartTime(request.getDateTime());
        appointment.setClient(client);
        appointment.setBarber(barber);

        // Note: Services list needs to be populated separately as it involves
        // AppointmentService entities
        // which might need the Appointment entity to be persisted first or managed
        // carefully.
        // For simple mapping we just set basic fields.

        return appointment;
    }
}
