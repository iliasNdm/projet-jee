package org.example.barber_shop.dao.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.*;

@Entity
@Getter
@Setter
@ToString(exclude = "user")
@NoArgsConstructor
@AllArgsConstructor
public class Barber {
    @Id
    private Long id;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id" )
    private User user;

    private double salary;
    private LocalDateTime hireDate;

    @OneToMany(mappedBy = "barber", fetch = FetchType.LAZY)
    private List<Appointment> appointments;

    public Barber(User user, double salary, LocalDateTime hireDate) {
        this.user = user;
        this.salary = salary;
        this.hireDate = hireDate;
    }
}
