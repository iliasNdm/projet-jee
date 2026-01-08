package org.example.barber_shop.dao.repositories;
import org.example.barber_shop.dao.entities.*;
import org.springframework.data.jpa.repository.JpaRepository;
public interface BarberRepository extends JpaRepository<Barber,Long> {
        //logique vient apres
        Barber save(Barber barber);
}
