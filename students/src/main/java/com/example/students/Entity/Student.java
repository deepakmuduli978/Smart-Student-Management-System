package com.example.students.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(nullable=false)
    String name;
    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String rollNo;

    private String phone;

    private String address;

    private String department;

    private String course;


    private Integer semester;

    private String gender;
    @NotNull
    private String dateOfBirth;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private StudentStatus status = StudentStatus.PENDING;

    public void setDeleted(boolean b) {

    }
}

