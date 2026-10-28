package com.example.students.Controller;

import com.example.students.Dto.ResultRequestDto;
import com.example.students.Entity.Result;
import com.example.students.Service.ResultService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/results")
@RequiredArgsConstructor
public class ResultController {

    private final ResultService resultService;

    @PostMapping
    public ResponseEntity<Result> addResult(
            @Valid @RequestBody ResultRequestDto dto) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(resultService.addResult(dto));
    }

    @GetMapping
    public ResponseEntity<List<Result>> getAllResults() {
        return ResponseEntity.ok(resultService.getAllResults());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Result> getResultById(
            @PathVariable Long id) {

        return ResponseEntity.ok(resultService.getResultById(id));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Result>> getResultsByStudent(
            @PathVariable Long studentId) {

        return ResponseEntity.ok(
                resultService.getResultsByStudent(studentId)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Result> updateResult(
            @PathVariable Long id,
            @Valid @RequestBody ResultRequestDto dto) {

        return ResponseEntity.ok(
                resultService.updateResult(id, dto)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResult(
            @PathVariable Long id) {

        resultService.deleteResult(id);

        return ResponseEntity.noContent().build();
    }
}