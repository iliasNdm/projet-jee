package org.example.barber_shop.controllers.auth;

import lombok.RequiredArgsConstructor;
import org.example.barber_shop.dto.request.LoginRequest;
import org.example.barber_shop.dto.request.RegisterRequest;
import org.example.barber_shop.dto.response.AuthResponse;
import org.example.barber_shop.service_layer.auth.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
