package org.example.barber_shop.dao.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.*;

@Entity
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;
    @Column(nullable = false)
    private String password;

    private String firstName;
    private String lastName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    private boolean newsletterSubscribed = false;

    // Un user en tant que CLIENT peut avoir plusieurs rendez-vous
    @OneToMany(mappedBy = "client", fetch = FetchType.LAZY)
    private List<Appointment> appointmentsAsClient;

    public boolean isBarber() {
        return this.role == UserRole.BARBER;
    }

}

