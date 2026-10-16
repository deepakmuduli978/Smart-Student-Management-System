package com.example.students.Controller;

import com.example.students.Dto.StudentRequestDTO;
import com.example.students.Dto.StudentResponseDTO;
import com.example.students.Service.StudentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
public class StudentController{

    private final StudentService service;

    public StudentController(StudentService service) {
        this.service = service;
    }

    @PostMapping("/register")
    public ResponseEntity<StudentResponseDTO> register(
            @RequestBody StudentRequestDTO request) {

        StudentResponseDTO response =
                service.registerStudent(request);

        return new ResponseEntity<>(
                response,
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentResponseDTO> getStudent(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
                service.getStudent(id)
        );
    }
}