package com.example.students.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;

@Data
@AllArgsConstructor
public class LoginResponseDto {
    private String message;
    private Integer id;
    private String name;
    private String email;
    private String role;
    private String status;
}
