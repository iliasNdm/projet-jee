package org.example.barber_shop.service_layer.appointment.impl;
import org.example.barber_shop.dao.entities.*;
import org.example.barber_shop.dao.repositories.*;
import org.example.barber_shop.dto.appointment.AppointmentCreationRequest;
import org.example.barber_shop.dto.service.ServiceResponse;
import org.example.barber_shop.exception.ResourceNotFoundException;
import org.example.barber_shop.dto.appointment.AppointmentResponse;
import org.example.barber_shop.service_layer.appointment.AppointmentManager;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
public class AppointmentManagerImpl implements AppointmentManager {
    private final AppointmentRepository appointmentRepository;
    private final AppointmentServiceRepository appointmentServiceRepository;
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final BarberRepository barberRepository;


    public AppointmentManagerImpl(AppointmentRepository appointmentRepository,
                                  AppointmentServiceRepository appointmentServiceRepository,
                                  UserRepository userRepository,
                                  ServiceRepository serviceRepository,
                                  BarberRepository barberRepository) {
        this.appointmentRepository = appointmentRepository;
        this.appointmentServiceRepository = appointmentServiceRepository;
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.barberRepository = barberRepository;
    }

    @Override
    @Transactional
    public AppointmentResponse getAppointmentDetails(Long appointmentId) {

        Appointment appointmentEntity = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found."));
        String barberName = appointmentEntity.getBarber().getUser().getFirstName();

        List<ServiceResponse> serviceResponses = appointmentEntity.getServices().stream()
                // Map AppointmentService (Join Entity) to Service (Core Entity)
                .map(AppointmentService::getService)

                .map(serviceEntity -> new ServiceResponse(
                        serviceEntity.getId(),
                        serviceEntity.getName(),
                        serviceEntity.getDurationMinutes(),
                        serviceEntity.getPrice()
                ))

                // Collect results into a List
                .collect(Collectors.toList());
        return new AppointmentResponse(
                appointmentEntity.getId(),
                appointmentEntity.getStartTime(),
                appointmentEntity.getStatus(),
                barberName,
                serviceResponses
        );
    }

    @Override
    @Transactional
    public AppointmentResponse bookAppointment(AppointmentCreationRequest request,
                                               Long userId) {

        //  Récupération le client (User)
        User client = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found."));

        // Récupération du barber
        Barber barber = barberRepository.findById(request.getBarberId())
                .orElseThrow(() -> new ResourceNotFoundException("Barber not found."));

        // Récupération des services
        List<Service> services = serviceRepository.findAllById(request.getServiceIds());
        if (services.isEmpty()) {
            throw new ResourceNotFoundException("No valid services provided.");
        }

        //  Calculer la durée totale + endTime
        int totalDuration = services.stream()
                .mapToInt(Service::getDurationMinutes)
                .sum();

        LocalDateTime startTime = request.getDateTime();
        LocalDateTime endTime = startTime.plusMinutes(totalDuration);

        //  TODO: vérifier les conflits de créneau pour ce barber

        //  Créer l'Appointment
        Appointment appointment = new Appointment();
        appointment.setClient(client);
        appointment.setBarber(barber);
        appointment.setStartTime(startTime);
        appointment.setEndTime(endTime);
        appointment.setStatus(AppointmentStatus.PENDING);
        appointment.setCreatedAt(LocalDateTime.now());

        Appointment savedAppointment = appointmentRepository.save(appointment);

        // Création les liens dans la table de jonction AppointmentService
        List<AppointmentService> appointmentServices = services.stream()
                .map(service -> {
                    AppointmentService join = new AppointmentService();
                    join.setAppointment(savedAppointment);
                    join.setService(service);
                    return join;
                })
                .collect(Collectors.toList());

        appointmentServiceRepository.saveAll(appointmentServices);
        savedAppointment.setServices(appointmentServices); // si relation bidirectionnelle

        // Réutiliser le mapper existant
        return getAppointmentDetails(savedAppointment.getId());
    }


    @Override
    @Transactional
    public Boolean cancelAppointment(Long appointmentId, Long clientId) {

        Appointment appointment = appointmentRepository
                .findByIdAndClient_Id(appointmentId, clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found."));

        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointmentRepository.save(appointment);

        return true;
    }
    @Override
    @Transactional
    public AppointmentResponse updateAppointmentTime(Long appointmentId,
                                                     LocalDateTime newDateTime,
                                                     Long clientId) {

        Appointment appointment = appointmentRepository
                .findByIdAndClient_Id(appointmentId, clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found."));


        if (appointment.getStatus() == AppointmentStatus.CANCELLED
                || appointment.getStatus() == AppointmentStatus.DONE) {
            throw new IllegalStateException("Cannot update time of a cancelled or done appointment.");
        }

        int totalDuration = appointment.getServices().stream()
                .map(AppointmentService::getService)
                .mapToInt(Service::getDurationMinutes)
                .sum();

        appointment.setStartTime(newDateTime);
        appointment.setEndTime(newDateTime.plusMinutes(totalDuration));

        appointmentRepository.save(appointment);

        return getAppointmentDetails(appointment.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentResponse> findMyAppointments(Long clientId) {
        return appointmentRepository.findByClient_IdOrderByStartTimeAsc(clientId)
                .stream()
                .map(a -> new AppointmentResponse(
                        a.getId(),
                        a.getStartTime(),
                        a.getStatus(),
                        a.getBarber().getUser().getFirstName(),
                        a.getServices().stream()
                                .map(AppointmentService::getService)
                                .map(s -> new ServiceResponse(
                                        s.getId(),
                                        s.getName(),
                                        s.getDurationMinutes(),
                                        s.getPrice()
                                ))
                                .toList()
                ))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentResponse> findAppointmentByBarberId(Long barberId) {

        // vérifier que le barber existe
        if (!barberRepository.existsById(barberId)) {
            throw new ResourceNotFoundException("Barber not found.");
        }

        // Récupérer les rendez-vous de ce barber
        List<Appointment> appointments =
                appointmentRepository.findByBarber_IdOrderByStartTimeAsc(barberId);

        // Transformer chaque Appointment -> AppointmentResponse
        return appointments.stream()
                .map(appointmentEntity -> {
                    // Récupérer le nom du barber
                    String barberName = appointmentEntity.getBarber()
                            .getUser()
                            .getFirstName();

                    // Mapper les services
                    List<ServiceResponse> serviceResponses = appointmentEntity.getServices().stream()
                            .map(AppointmentService::getService)
                            .map(serviceEntity -> new ServiceResponse(
                                    serviceEntity.getId(),
                                    serviceEntity.getName(),
                                    serviceEntity.getDurationMinutes(),
                                    serviceEntity.getPrice()
                            ))
                            .collect(Collectors.toList());


                    return new AppointmentResponse(
                            appointmentEntity.getId(),
                            appointmentEntity.getStartTime(),
                            appointmentEntity.getStatus(),
                            barberName,
                            serviceResponses
                    );
                })
                .collect(Collectors.toList());
    }
}
