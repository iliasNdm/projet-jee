package org.example.barber_shop.service_layer.barber;

import org.example.barber_shop.dao.entities.Barber;
import org.example.barber_shop.dto.barber.*;

import java.util.*;

public interface BarberManager {
    Barber createBarber(BarberCreationRequest request);

    BarberInternalDTO getBarberById(Long id);

    List<BarberResponse> getAllBarbers();

    BarberInternalDTO updateBarber(Long id, BarberCreationRequest request);

    void deleteBarber(Long id);
}
