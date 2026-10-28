package com.example.students.Service;

import com.example.students.Dto.LoginRequestDto;
import com.example.students.Dto.LoginResponseDto;
import com.example.students.Entity.Student;
import com.example.students.Entity.Teacher;
import com.example.students.Repository.StudentRepository;
import com.example.students.Repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;

    public LoginResponseDto login(LoginRequestDto request) {

        Student student = studentRepository
                .findByEmail(request.getEmail())
                .orElse(null);

        if (student != null) {

            if (!student.getPassword().equals(request.getPassword())) {
                throw new RuntimeException("Invalid email or password");
            }

            return new LoginResponseDto(
                    "Login successful",
                    Math.toIntExact(student.getId()),
                    student.getName(),
                    student.getEmail(),
                    "STUDENT",
                    student.getStatus().name()
            );
        }

        Teacher teacher = teacherRepository
                .findByEmail(request.getEmail())
                .orElse(null);

        if (teacher != null) {

            if (!teacher.getPassword().equals(request.getPassword())) {
                throw new RuntimeException("Invalid email or password");
            }

            return new LoginResponseDto(
                    "Login successful",
                    teacher.getId(),
                    teacher.getName(),
                    teacher.getEmail(),
                    "TEACHER",
                    teacher.getStatus().name()
            );
        }

        throw new RuntimeException("Invalid email or password");
    }
}