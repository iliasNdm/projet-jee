package org.example.barber_shop.service_layer.auth.impl;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.barber_shop.dao.entities.User;
import org.example.barber_shop.dao.entities.UserRole;
import org.example.barber_shop.dto.request.LoginRequest;
import org.example.barber_shop.dto.request.RegisterRequest;
import org.example.barber_shop.dto.response.AuthResponse;
import org.example.barber_shop.dao.repositories.UserRepository;
import org.example.barber_shop.security.jwt.JwtService;
import org.example.barber_shop.service_layer.auth.AuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;


@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        final String email = request.email().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already in use");
        }
        //Creation du User
        User user = new User();
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(UserRole.CUSTOMER);
        //sauvgarde du user
        userRepository.save(user);
        // Option: auto-login après register (sinon laisse token = null)
        String token = jwtService.generateToken(
                user.getEmail(),
                Map.of("userId", user.getId(), "role", user.getRole().name())
        );
        return new AuthResponse(
                user.getId(),
                user.getEmail(),
                user.getRole().name(),
                token
        );

    }
    @Override
    public AuthResponse login(LoginRequest request) {
        final String email = request.email().trim().toLowerCase();
        // 1) Récupération du user par email
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        //Vérification du mot de passe
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        String token = jwtService.generateToken(
                user.getEmail(),
                Map.of("userId", user.getId(), "role", user.getRole().name())
        );
        // 3) Retourner réponse sans JWT pour le moment
        return new AuthResponse(
                user.getId(),
                user.getEmail(),
                user.getRole().name(),
                token
        );
    }
}