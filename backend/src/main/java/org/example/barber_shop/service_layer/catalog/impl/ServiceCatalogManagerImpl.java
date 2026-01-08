package org.example.barber_shop.service_layer.catalog.impl;

import lombok.RequiredArgsConstructor;
import org.example.barber_shop.dao.entities.Service;
import org.example.barber_shop.dao.repositories.ServiceRepository;
import org.example.barber_shop.dto.service.ServiceCreationRequest;
import org.example.barber_shop.dto.service.ServiceResponse;
import org.example.barber_shop.service_layer.catalog.ServiceCatalogManager;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class ServiceCatalogManagerImpl implements ServiceCatalogManager {

    private final ServiceRepository serviceRepository;

    @Override
    @Transactional
    public ServiceResponse createService(ServiceCreationRequest request) {
        Service service = new Service();
        service.setName(request.getName());
        service.setDurationMinutes(request.getDurationMinutes());
        service.setPrice(request.getPrice());

        Service savedService = serviceRepository.save(service);
        return mapToResponse(savedService);
    }

    @Override
    @Transactional
    public ServiceResponse updateService(Long id, ServiceCreationRequest request) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found with id: " + id)); 
                                                                                             

        service.setName(request.getName());
        service.setDurationMinutes(request.getDurationMinutes());
        service.setPrice(request.getPrice());

        Service updatedService = serviceRepository.save(service);
        return mapToResponse(updatedService);
    }

    @Override
    @Transactional
    public void deleteService(Long id) {
        if (!serviceRepository.existsById(id)) {
            throw new RuntimeException("Service not found with id: " + id);
        }
        serviceRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public ServiceResponse getServiceById(Long id) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found with id: " + id));
        return mapToResponse(service);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceResponse> getAllServices() {
        return serviceRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ServiceResponse mapToResponse(Service service) {
        ServiceResponse response = new ServiceResponse();
        response.setId(service.getId());
        response.setName(service.getName());
        response.setDurationMinutes(service.getDurationMinutes());
        response.setPrice(service.getPrice());
        return response;
    }
}
