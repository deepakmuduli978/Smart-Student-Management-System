package com.example.students.Service;

import com.example.students.Dto.StudentRequestDTO;
import com.example.students.Dto.StudentResponseDTO;
import com.example.students.Entity.Student;
import com.example.students.Repository.StudentRepository;
import org.springframework.stereotype.Service;

@Service
public class StudentService{

    private final StudentRepository repository;
    private final MappingEntityDtoStudent mapper;

    public StudentService(
            StudentRepository repository,
            MappingEntityDtoStudent mapper) {

        this.repository = repository;
        this.mapper = mapper;
    }

    public StudentResponseDTO registerStudent(
            StudentRequestDTO request) {

        // Business logic
        if (repository.existsByEmail(request.getEmail())) {
            throw new RuntimeException(
                    "Email already exists"
            );
        }

        if (repository.existsByRollNo(request.getRollNo())) {
            throw new RuntimeException(
                    "Roll number already exists"
            );
        }

        // DTO → Entity
        Student student =
                mapper.dtoToEntity(request);

        // New student needs admin approval

        // Save
        Student saved =
                repository.save(student);

        // Entity → Response DTO
        return mapper.entityToDto(saved);
    }

    public StudentResponseDTO getStudent(Integer id) {

        Student student =
                repository
                        .findById((long)id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student not found"
                                )
                        );

        return mapper.entityToDto(student);
    }
}