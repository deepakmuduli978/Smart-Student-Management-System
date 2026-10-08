package com.example.students.Controller;

import com.example.students.Dto.AdminDto;
import com.example.students.Entity.Admin;
import com.example.students.Entity.Student;
import com.example.students.Entity.Teacher;
import com.example.students.Service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/create")
    public ResponseEntity<Admin> createAdmin(
            @Valid @RequestBody AdminDto dto) {

        Admin admin = adminService.createAdmin(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(admin);
    }
    @GetMapping("/pending-students")
    public ResponseEntity<List<Student>> getPendingStudents() {
        return ResponseEntity.ok(
                adminService.getPendingStudents()
        );
    }
    @GetMapping("/pending-teachers")
    public ResponseEntity<List<Teacher>> getPendingTeachers() {
        return ResponseEntity.ok(
                adminService.getPendingTeachers()
        );
    }
    @PutMapping("/students/{id}/approve")
    public ResponseEntity<Student> approveStudent(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
                adminService.approveStudent(id)
        );
    }
    @PutMapping("/students/{id}/reject")
    public ResponseEntity<Student> rejectStudent(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
                adminService.rejectStudent(id)
        );
    }
    @PutMapping("/teachers/{id}/approve")
    public ResponseEntity<Teacher> approveTeacher(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
                adminService.approveTeacher(id)
        );
    }
    @PutMapping("/teachers/{id}/reject")
    public ResponseEntity<Teacher> rejectTeacher(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
                adminService.rejectTeacher(id)
        );
    }
}