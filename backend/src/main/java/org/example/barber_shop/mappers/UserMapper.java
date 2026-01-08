package org.example.barber_shop.mappers;

import org.example.barber_shop.dao.entities.User;
import org.example.barber_shop.dto.user.UserResponse;
import org.example.barber_shop.dto.user.UserUpdateRequest;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {
        if (user == null) {
            return null;
        }
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole(),
                user.getCreatedAt(),
                user.isNewsletterSubscribed());
    }

    public void updateEntityFromRequest(UserUpdateRequest request, User user) {
        if (request == null || user == null) {
            return;
        }
        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        user.setNewsletterSubscribed(request.isNewsletterSubscribed());
    }
}
