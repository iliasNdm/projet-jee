package org.example.barber_shop.dao.entities;

import org.springframework.security.core.GrantedAuthority;

public enum UserRole implements GrantedAuthority {
    ADMIN, BARBER, CUSTOMER;

    @Override
    public String getAuthority() {
        return this.name();
    }
}
