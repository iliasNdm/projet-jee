package org.example.barber_shop.controllers.client;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.barber_shop.dto.user.UserResponse;
import org.example.barber_shop.dto.user.UserUpdateRequest;
import org.example.barber_shop.exception.ResourceNotFoundException;
import org.example.barber_shop.service_layer.user.UserManager;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/client/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final UserManager userManager;

    @GetMapping
    public ResponseEntity<UserResponse> getProfile(Authentication authentication) {
        String email = authentication.getName();
        UserResponse response = userManager.getUserByEmail(email);
        if (response == null) {
            throw new ResourceNotFoundException("User not found");
        }
        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<UserResponse> updateProfile(
            @Valid @RequestBody UserUpdateRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        UserResponse user = userManager.getUserByEmail(email);
        if (user == null) {
            throw new ResourceNotFoundException("User not found");
        }
        return ResponseEntity.ok(userManager.updateUser(user.getId(), request));
    }
}
