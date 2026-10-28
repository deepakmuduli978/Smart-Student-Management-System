package com.example.students.Controller;

import com.example.students.Dto.StudentDashboardResponseDto;
import com.example.students.Service.StudentDashboardService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student-dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentDashboardController {

    private final StudentDashboardService studentDashboardService;

    public StudentDashboardController(
            StudentDashboardService studentDashboardService) {
        this.studentDashboardService = studentDashboardService;
    }

    @GetMapping("/{studentId}")
    public ResponseEntity<StudentDashboardResponseDto> getDashboard(
            @PathVariable Long studentId) {

        StudentDashboardResponseDto dashboard =
                studentDashboardService.getDashboard(studentId);

        return ResponseEntity.ok(dashboard);
    }
}