package org.example.barber_shop.mappers;

import org.example.barber_shop.dao.entities.*;
import org.example.barber_shop.dto.appointment.AppointmentCreationRequest;
import org.example.barber_shop.dto.appointment.AppointmentResponse;
import org.example.barber_shop.dto.barber.BarberCreationRequest;
import org.example.barber_shop.dto.barber.BarberResponse;
import org.example.barber_shop.dto.service.ServiceCreationRequest;
import org.example.barber_shop.dto.service.ServiceResponse;
import org.example.barber_shop.dto.user.UserResponse;
import org.example.barber_shop.dto.user.UserUpdateRequest;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class MappersTest {

    private final UserMapper userMapper = new UserMapper();
    private final BarberMapper barberMapper = new BarberMapper();
    private final ServiceMapper serviceMapper = new ServiceMapper();
    private final AppointmentMapper appointmentMapper = new AppointmentMapper(serviceMapper);

    @Test
    void testUserMapper() {
        User user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setRole(UserRole.CUSTOMER);
        user.setCreatedAt(new Date());
        user.setNewsletterSubscribed(true);

        UserResponse response = userMapper.toResponse(user);

        Assertions.assertEquals(user.getId(), response.getId());
        Assertions.assertEquals(user.getEmail(), response.getEmail());
        Assertions.assertEquals(user.getFirstName(), response.getFirstName());
        Assertions.assertEquals(user.getLastName(), response.getLastName());
        Assertions.assertEquals(user.getRole(), response.getRole());
        Assertions.assertEquals(user.getCreatedAt(), response.getCreatedAt());
        Assertions.assertTrue(response.isNewsletterSubscribed());

        UserUpdateRequest updateRequest = new UserUpdateRequest("Jane", "Smith", false);
        userMapper.updateEntityFromRequest(updateRequest, user);

        Assertions.assertEquals("Jane", user.getFirstName());
        Assertions.assertEquals("Smith", user.getLastName());
        Assertions.assertFalse(user.isNewsletterSubscribed());
    }

    @Test
    void testBarberMapper() {
        User user = new User();
        user.setId(2L);
        user.setFirstName("Barber");
        user.setLastName("Man");
        user.setEmail("barber@example.com");

        Barber barber = new Barber();
        barber.setId(2L);
        barber.setUser(user);
        barber.setSalary(5000.0);

        BarberResponse response = barberMapper.toResponse(barber);
        Assertions.assertEquals(barber.getId(), response.getBarberId());
        Assertions.assertEquals("Barber Man", response.getBarberName());
        Assertions.assertEquals("barber@example.com", response.getBarberEmail());

        BarberCreationRequest request = new BarberCreationRequest();
        request.setSalary(6000.0);
        request.setHireDate(LocalDateTime.now());

        Barber createdBarber = barberMapper.toEntity(request, user);
        Assertions.assertEquals(user, createdBarber.getUser());
        Assertions.assertEquals(6000.0, createdBarber.getSalary());
    }

    @Test
    void testServiceMapper() {
        Service service = new Service();
        service.setId(10L);
        service.setName("Haircut");
        service.setDurationMinutes(30);
        service.setPrice(30.0);

        ServiceResponse response = serviceMapper.toResponse(service);
        Assertions.assertEquals(service.getId(), response.getId());
        Assertions.assertEquals(service.getName(), response.getName());
        Assertions.assertEquals(service.getDurationMinutes(), response.getDurationMinutes());
        Assertions.assertEquals(service.getPrice(), response.getPrice());

        ServiceCreationRequest request = new ServiceCreationRequest();
        request.setName("Shave");
        request.setDurationMinutes(20);
        request.setPrice(25.0);

        Service createdService = serviceMapper.toEntity(request);
        Assertions.assertEquals(request.getName(), createdService.getName());
        Assertions.assertEquals(request.getDurationMinutes(), createdService.getDurationMinutes());
        Assertions.assertEquals(request.getPrice(), createdService.getPrice());
    }

    @Test
    void testAppointmentMapper() {
        User client = new User();
        client.setFirstName("Client");
        client.setLastName("One");

        User barberUser = new User();
        barberUser.setFirstName("Barber");
        barberUser.setLastName("Two");

        Barber barber = new Barber();
        barber.setUser(barberUser);

        Service service = new Service();
        service.setId(1L);
        service.setName("Cut");
        service.setPrice(20.0);

        Appointment appointment = new Appointment();
        appointment.setId(100L);
        appointment.setClient(client);
        appointment.setBarber(barber);
        appointment.setStartTime(LocalDateTime.now());
        appointment.setStatus(AppointmentStatus.CONFIRMED);

        AppointmentService as = new AppointmentService();
        as.setService(service);
        as.setAppointment(appointment);

        List<AppointmentService> services = new ArrayList<>();
        services.add(as);
        appointment.setServices(services);

        AppointmentResponse response = appointmentMapper.toResponse(appointment);
        Assertions.assertEquals(appointment.getId(), response.getAppointmentId());
        Assertions.assertEquals("Barber Two", response.getBarberName());
        Assertions.assertEquals(1, response.getServices().size());
        Assertions.assertEquals("Cut", response.getServices().get(0).getName());

        AppointmentCreationRequest request = new AppointmentCreationRequest();
        request.setDateTime(LocalDateTime.now().plusHours(1));

        Appointment createdAppointment = appointmentMapper.toEntity(request, client, barber);
        Assertions.assertEquals(client, createdAppointment.getClient());
        Assertions.assertEquals(barber, createdAppointment.getBarber());
        Assertions.assertEquals(request.getDateTime(), createdAppointment.getStartTime());
    }
}
