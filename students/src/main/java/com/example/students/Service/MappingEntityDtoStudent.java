package com.example.students.Service;

import com.example.students.Dto.StudentRequestDTO;
import com.example.students.Dto.StudentResponseDTO;
import com.example.students.Entity.Student;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class MappingEntityDtoStudent{

    // Request DTO → Entity
    public Student dtoToEntity(StudentRequestDTO dto) {

        Student student = new Student();

        student.setName(dto.getName());
        student.setEmail(dto.getEmail());
        student.setRollNo(dto.getRollNo());
        student.setDepartment(dto.getDepartment());
        student.setAddress(dto.getAddress());
        student.setDateOfBirth(dto.getDateOfBirth());
        student.setGender(dto.getGender());
        student.setSemester(dto.getSemester());
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
    public List<StudentResponseDTO> entityToDtolist(List<Student> std){
        List<StudentResponseDTO> srdto=new ArrayList<>();
        for(Student student:std) {
            StudentResponseDTO dto=new StudentResponseDTO();
            dto.setId((int) student.getId());
            dto.setName(student.getName());
            dto.setEmail(student.getEmail());
            dto.setRollNo(student.getRollNo());
            dto.setDepartment(student.getDepartment());
            dto.setDateOfBirth(student.getDateOfBirth());
            dto.setCourse(student.getCourse());
            dto.setStatus(student.getStatus());
            dto.setSemester(student.getSemester() != null ? student.getSemester() : 0);
            dto.setPhone(student.getPhone());
            dto.setStatus(student.getStatus());
            srdto.add(dto);
        }
        return srdto;
    }
}