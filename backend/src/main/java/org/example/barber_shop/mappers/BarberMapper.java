package org.example.barber_shop.mappers;

import org.example.barber_shop.dao.entities.Barber;
import org.example.barber_shop.dao.entities.User;
import org.example.barber_shop.dto.barber.BarberCreationRequest;
import org.example.barber_shop.dto.barber.BarberResponse;
import org.springframework.stereotype.Component;

@Component
public class BarberMapper {

    public BarberResponse toResponse(Barber barber) {
        if (barber == null) {
            return null;
        }
        BarberResponse response = new BarberResponse();
        response.setBarberId(barber.getId());
        if (barber.getUser() != null) {
            response.setBarberName(barber.getUser().getFirstName() + " " + barber.getUser().getLastName());
            response.setBarberEmail(barber.getUser().getEmail());
        }
        return response;
    }

    public Barber toEntity(BarberCreationRequest request, User user) {
        if (request == null || user == null) {
            return null;
        }
        Barber barber = new Barber();
        barber.setUser(user);
        barber.setSalary(request.getSalary());
        barber.setHireDate(request.getHireDate());
        return barber;
    }
}
