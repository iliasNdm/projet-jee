package org.example.barber_shop.dto.barber;

import lombok.Data;

@Data
public class BarberResponse {

    Long barberId;
    String barberName;
    String barberEmail;
//    Double barberRating add later, rn focus on mvp
}
