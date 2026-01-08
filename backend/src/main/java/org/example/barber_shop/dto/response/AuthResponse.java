package org.example.barber_shop.dto.response;

public record AuthResponse(
        Long UserId,
        String email,
        String role,
        String token
) {}
