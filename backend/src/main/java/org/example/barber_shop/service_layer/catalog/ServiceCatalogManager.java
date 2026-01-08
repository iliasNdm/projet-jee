package org.example.barber_shop.service_layer.catalog;

import org.example.barber_shop.dto.service.ServiceCreationRequest;
import org.example.barber_shop.dto.service.ServiceResponse;

import java.util.List;

public interface ServiceCatalogManager {
    ServiceResponse createService(ServiceCreationRequest request);

    ServiceResponse updateService(Long id, ServiceCreationRequest request);

    void deleteService(Long id);

    ServiceResponse getServiceById(Long id);

    List<ServiceResponse> getAllServices();
}
