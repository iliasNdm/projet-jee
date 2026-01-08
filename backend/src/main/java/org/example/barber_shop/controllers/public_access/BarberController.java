package org.example.barber_shop.controllers.public_access;

import lombok.RequiredArgsConstructor;
import org.example.barber_shop.dto.barber.BarberResponse;
import org.example.barber_shop.service_layer.barber.BarberManager;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public/barbers")
@RequiredArgsConstructor
public class BarberController {

    private final BarberManager barberManager;

    @GetMapping
    public ResponseEntity<List<BarberResponse>> getAllBarbers() {
        return ResponseEntity.ok(barberManager.getAllBarbers());
    }
}
