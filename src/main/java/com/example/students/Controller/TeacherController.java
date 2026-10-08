package com.example.students.Controller;

import com.example.students.Dto.TeacherCreateRequestDto;
import com.example.students.Dto.TeacherResponseDto;
import com.example.students.Dto.TeacherUpdateRequestDto;
import com.example.students.Service.TeacherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teachers")
@RequiredArgsConstructor
public class TeacherController {

    private final TeacherService teacherService;

    // CREATE TEACHER
    @PostMapping("/register")
    public ResponseEntity<TeacherResponseDto> createTeacher(
            @Valid @RequestBody TeacherCreateRequestDto dto) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(teacherService.createTeacher(dto));
    }

    // GET TEACHER
    @GetMapping("/{id}")
    public ResponseEntity<TeacherResponseDto> getTeacher(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
                teacherService.getTeacherById(id)
        );
    }

    // GET ALL TEACHERS
    @GetMapping
    public ResponseEntity<List<TeacherResponseDto>> getAllTeachers() {

        return ResponseEntity.ok(
                teacherService.getAllTeachers()
        );
    }

    // UPDATE TEACHER
    @PutMapping("/{id}")
    public ResponseEntity<TeacherResponseDto> updateTeacher(
            @PathVariable Integer id,
            @Valid @RequestBody TeacherUpdateRequestDto dto) {

        return ResponseEntity.ok(
                teacherService.updateTeacher(id, dto)
        );
    }

    // DELETE TEACHER
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTeacher(
            @PathVariable Integer id) {

        teacherService.deleteTeacher(id);

        return ResponseEntity.ok(
                "Teacher deleted successfully"
        );
    }

    // ACTIVATE / DEACTIVATE
    @PatchMapping("/{id}/status")
    public ResponseEntity<TeacherResponseDto> changeStatus(
            @PathVariable Integer id,
            @RequestParam boolean active) {

        return ResponseEntity.ok(
                teacherService.changeStatus(id, active)
        );
    }
}