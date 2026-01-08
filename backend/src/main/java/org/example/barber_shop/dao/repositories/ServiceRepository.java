package org.example.barber_shop.dao.repositories;

import org.example.barber_shop.dao.entities.Service;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceRepository extends JpaRepository<Service,Long> {
}
