package org.example.barber_shop.dao.repositories;

import org.example.barber_shop.dao.entities.AppointmentService;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentServiceRepository extends JpaRepository<AppointmentService, Long> {
//    static AppointmentService findAppointmentService(Long id) {
//    }
}
