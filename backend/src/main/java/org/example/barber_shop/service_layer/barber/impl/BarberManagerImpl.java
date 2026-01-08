package org.example.barber_shop.service_layer.barber.impl;

import lombok.RequiredArgsConstructor;
import org.example.barber_shop.dao.entities.Barber;
import org.example.barber_shop.dao.entities.User;
import org.example.barber_shop.dao.entities.UserRole;
import org.example.barber_shop.dao.repositories.BarberRepository;
import org.example.barber_shop.dao.repositories.UserRepository;
import org.example.barber_shop.dto.barber.BarberCreationRequest;
import org.example.barber_shop.dto.barber.BarberInternalDTO;
import org.example.barber_shop.dto.barber.BarberResponse;
import org.example.barber_shop.service_layer.barber.BarberManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BarberManagerImpl implements BarberManager {

    private final BarberRepository barberRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final org.example.barber_shop.mappers.BarberMapper barberMapper;

    @Override
    @Transactional
    public Barber createBarber(BarberCreationRequest barberDto) {
        if (userRepository.existsByEmail(barberDto.getEmail())) {
            throw new RuntimeException("User with this email already exists");
        }

        User user = new User();
        user.setEmail(barberDto.getEmail());
        user.setPassword(passwordEncoder.encode(barberDto.getPassword()));
        user.setFirstName(barberDto.getFirstName());
        user.setLastName(barberDto.getLastName());
        user.setRole(UserRole.BARBER);
        user.setCreatedAt(new Date());

        User savedUser = userRepository.save(user);

        Barber barber = new Barber();
        barber.setUser(savedUser);
        barber.setSalary(barberDto.getSalary());
        barber.setHireDate(barberDto.getHireDate());

        return barberRepository.save(barber);
    }

    @Override
    public BarberInternalDTO getBarberById(Long id) {
        Barber barber = barberRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Barber not found with ID: " + id));

        return mapToInternalDTO(barber);
    }

    @Override
    public List<BarberResponse> getAllBarbers() {
        return barberRepository.findAll().stream()
                .map(barberMapper::toResponse)
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    @Transactional
    public BarberInternalDTO updateBarber(Long id, BarberCreationRequest request) {
        Barber barber = barberRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Barber not found with ID: " + id));

        User user = barber.getUser();

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        barber.setSalary(request.getSalary());
        barber.setHireDate(request.getHireDate());

        Barber updatedBarber = barberRepository.save(barber);

        return mapToInternalDTO(updatedBarber);
    }

    @Override
    @Transactional
    public void deleteBarber(Long id) {
        Barber barber = barberRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Barber not found with ID: " + id));

        User userToDelete = barber.getUser();

        barberRepository.delete(barber);

        if (userToDelete != null) {
            userRepository.delete(userToDelete);
        }
    }

    private BarberInternalDTO mapToInternalDTO(Barber barber) {
        User user = barber.getUser();

        return BarberInternalDTO.builder()
                .id(barber.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .salary(barber.getSalary())
                .hireDate(barber.getHireDate())
                .build();
    }
}