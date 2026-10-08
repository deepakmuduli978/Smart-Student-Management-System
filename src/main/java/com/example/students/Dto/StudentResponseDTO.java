package com.example.students.Dto;
import com.example.students.Entity.Student;
import com.example.students.Entity.StudentStatus;
import lombok.Data;

import java.time.LocalDate;

@Data
public class StudentResponseDTO {

    private Integer id;
    private String name;
    private String email;
    private String rollNo;
    private String department;
    private String course;
    private String phone;
    private boolean approved;
    private String dateOfBirth;
    private StudentStatus Status;
}