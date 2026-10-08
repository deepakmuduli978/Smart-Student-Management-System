package com.example.students.Dto;

import lombok.Data;

@Data
public class StudentRequestDTO {

    private String name;

    private String email;

    private String rollNo;

    private String phone;

    private String address;

    private String department;

    private String course;

    private Integer semester;

    private String gender;

    private String dateOfBirth;

    private String password;
}