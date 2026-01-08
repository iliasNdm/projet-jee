package org.example.barber_shop.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ErrorResponse {
    private String error;   // ex: "NOT_FOUND", "BAD_REQUEST"
    private String message; // message détaillé
}
