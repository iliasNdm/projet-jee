package org.example.barber_shop.controllers.public_access;

import lombok.RequiredArgsConstructor;
import org.example.barber_shop.dto.service.ServiceResponse;
import org.example.barber_shop.service_layer.catalog.ServiceCatalogManager;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public/services")
@RequiredArgsConstructor
public class ServiceController {

    private final ServiceCatalogManager serviceCatalogManager;

    @GetMapping
    public ResponseEntity<List<ServiceResponse>> getAllServices() {
        return ResponseEntity.ok(serviceCatalogManager.getAllServices());
    }
}
