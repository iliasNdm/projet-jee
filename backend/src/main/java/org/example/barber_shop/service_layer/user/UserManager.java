package org.example.barber_shop.service_layer.user;

import org.example.barber_shop.dto.user.UserResponse;
import org.example.barber_shop.dto.user.UserUpdateRequest;

import java.util.List;

public interface UserManager {
    UserResponse getUserById(Long id);

    UserResponse getUserByEmail(String email);

    List<UserResponse> getAllUsers();

    UserResponse updateUser(Long id, UserUpdateRequest request);

    void deleteUser(Long id);
}
