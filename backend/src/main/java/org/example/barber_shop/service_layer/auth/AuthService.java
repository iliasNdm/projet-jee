package org.example.barber_shop.service_layer.auth;

import org.example.barber_shop.dto.request.LoginRequest;
import org.example.barber_shop.dto.request.RegisterRequest;
import org.example.barber_shop.dto.response.AuthResponse;
public interface AuthService {
    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
