package com.example.students.Service;

import com.example.students.Dto.TeacherCreateRequestDto;
import com.example.students.Dto.TeacherResponseDto;
import com.example.students.Dto.TeacherUpdateRequestDto;
import com.example.students.Entity.Role;
import com.example.students.Entity.Teacher;
import com.example.students.Entity.TeacherStatus;
import com.example.students.Repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeacherService {

    private final TeacherRepository teacherRepository;

    // CREATE
    public TeacherResponseDto createTeacher(
            TeacherCreateRequestDto dto) {

        if (teacherRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (teacherRepository.existsByPhone(dto.getPhone())) {
            throw new RuntimeException("Phone already exists");
        }

        Teacher teacher = Teacher.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .password(dto.getPassword())
                .phone(dto.getPhone())
                .department(dto.getDepartment())
                .subject(dto.getSubject())
                .status(TeacherStatus.PENDING)
                .role(Role.TEACHER)
                .active(false)
                .build();

        Teacher savedTeacher = teacherRepository.save(teacher);

        return mapToResponse(savedTeacher);
    }

    // GET BY ID
    public TeacherResponseDto getTeacherById(Integer id) {

        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Teacher not found"));

        return mapToResponse(teacher);
    }

    // GET ALL
    public List<TeacherResponseDto> getAllTeachers() {

        return teacherRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // UPDATE
    public TeacherResponseDto updateTeacher(
            Integer id,
            TeacherUpdateRequestDto dto) {

        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Teacher not found"));

        if (dto.getName() != null) {
            teacher.setName(dto.getName());
        }

        if (dto.getEmail() != null) {
            teacher.setEmail(dto.getEmail());
        }

        if (dto.getPhone() != null) {
            teacher.setPhone(dto.getPhone());
        }

        if (dto.getDepartment() != null) {
            teacher.setDepartment(dto.getDepartment());
        }

        if (dto.getSubject() != null) {
            teacher.setSubject(dto.getSubject());
        }

        Teacher updatedTeacher =
                teacherRepository.save(teacher);

        return mapToResponse(updatedTeacher);
    }

    // DELETE
    public void deleteTeacher(Integer id) {

        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Teacher not found"));

        teacherRepository.delete(teacher);
    }

    // ACTIVATE / DEACTIVATE
    public TeacherResponseDto changeStatus(
            Integer id,
            boolean active) {

        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Teacher not found"));

        teacher.setActive(active);

        return mapToResponse(
                teacherRepository.save(teacher)
        );
    }

    // ENTITY -> DTO
    private TeacherResponseDto mapToResponse(
            Teacher teacher) {

        return TeacherResponseDto.builder()
                .id(teacher.getId())
                .name(teacher.getName())
                .email(teacher.getEmail())
                .phone(teacher.getPhone())
                .department(teacher.getDepartment())
                .subject(teacher.getSubject())
                .role(teacher.getRole())
                .status(teacher.getStatus())
                .active(teacher.isActive())
                .build();
    }
}
