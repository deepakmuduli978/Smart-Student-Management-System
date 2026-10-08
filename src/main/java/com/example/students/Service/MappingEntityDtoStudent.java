package com.example.students.Service;

import com.example.students.Dto.StudentRequestDTO;
import com.example.students.Dto.StudentResponseDTO;
import com.example.students.Entity.Student;
import org.springframework.stereotype.Component;

@Component
public class MappingEntityDtoStudent{

    // Request DTO → Entity
    public Student dtoToEntity(StudentRequestDTO dto) {

        Student student = new Student();

        student.setName(dto.getName());
        student.setEmail(dto.getEmail());
        student.setRollNo(dto.getRollNo());
        student.setDepartment(dto.getDepartment());
        student.setDateOfBirth(dto.getDateOfBirth());
        student.setCourse(dto.getCourse());
        student.setPhone(dto.getPhone());
        student.setPassword(dto.getPassword());
        student.setDeleted(false);

        return student;
    }

    // Entity → Response DTO
    public StudentResponseDTO entityToDto(Student student) {

        StudentResponseDTO dto =
                new StudentResponseDTO();

        dto.setId((int) student.getId());
        dto.setName(student.getName());
        dto.setEmail(student.getEmail());
        dto.setRollNo(student.getRollNo());
        dto.setDepartment(student.getDepartment());
        dto.setDateOfBirth(student.getDateOfBirth());
        dto.setCourse(student.getCourse());
        dto.setPhone(student.getPhone());
        dto.setStatus(student.getStatus());

        return dto;
}
}