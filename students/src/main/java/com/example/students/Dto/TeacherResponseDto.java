package com.example.students.Dto;

import com.example.students.Entity.Role;
import com.example.students.Entity.TeacherStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeacherResponseDto {

    private Integer id;
    private String name;
    private String email;
    private String phone;
    private String department;
    private String subject;
    private Role role;
    private boolean active;
    private TeacherStatus status;
}
