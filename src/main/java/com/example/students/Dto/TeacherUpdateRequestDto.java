package com.example.students.Dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TeacherUpdateRequestDto {

    private String name;

    @Email(message = "Invalid email")
    private String email;

    @Pattern(
            regexp = "^[0-9]{10}$",
            message = "Phone must contain 10 digits"
    )
    private String phone;

    private String department;

    private String subject;
}