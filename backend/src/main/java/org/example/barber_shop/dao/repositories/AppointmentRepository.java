package org.example.barber_shop.dao.repositories;

import org.example.barber_shop.dao.entities.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AppointmentRepository extends JpaRepository<Appointment,Long> {
    List<Appointment> findByBarber_IdOrderByStartTimeAsc(Long barberId);
    List<Appointment> findByClient_IdOrderByStartTimeAsc(Long clientId);
    Optional<Appointment> findByIdAndClient_Id(Long id, Long clientId);
}
