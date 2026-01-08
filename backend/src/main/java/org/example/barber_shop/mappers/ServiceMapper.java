package org.example.barber_shop.mappers;

import org.example.barber_shop.dao.entities.Service;
import org.example.barber_shop.dto.service.ServiceCreationRequest;
import org.example.barber_shop.dto.service.ServiceResponse;
import org.springframework.stereotype.Component;

@Component
public class ServiceMapper {

    public ServiceResponse toResponse(Service service) {
        if (service == null) {
            return null;
        }
        return new ServiceResponse(
                service.getId(),
                service.getName(),
                service.getDurationMinutes(),
                service.getPrice());
    }

    public Service toEntity(ServiceCreationRequest request) {
        if (request == null) {
            return null;
        }
        Service service = new Service();
        service.setName(request.getName());
        service.setDurationMinutes(request.getDurationMinutes());
        service.setPrice(request.getPrice());
        return service;
    }
}
