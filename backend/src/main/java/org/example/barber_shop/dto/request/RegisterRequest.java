package org.example.barber_shop.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank
        String firstName,

        @NotBlank
        String lastName,

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid Email format")
        String email,

        @NotBlank
        @Size(min = 8, message = "Password must be at least 8 characters long")
        String password
) {}
