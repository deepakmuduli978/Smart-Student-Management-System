package com.example.students.Controller;

import com.example.students.Dto.FeeRequestDto;
import com.example.students.Entity.Fee;
import com.example.students.Service.FeeService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/fees")
@CrossOrigin(origins = "http://localhost:5173")
public class FeeController {

    private final FeeService feeService;

    public FeeController(FeeService feeService) {
        this.feeService = feeService;
    }

    @PostMapping
    public ResponseEntity<Fee> createFee(
            @Valid @RequestBody FeeRequestDto dto
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(feeService.createFee(dto));
    }

    @GetMapping
    public ResponseEntity<List<Fee>> getAllFees() {
        return ResponseEntity.ok(feeService.getAllFees());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Fee> getFeeById(@PathVariable Long id) {
        return ResponseEntity.ok(feeService.getFeeById(id));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Fee>> getFeesByStudent(
            @PathVariable Long studentId
    ) {
        return ResponseEntity.ok(
                feeService.getFeesByStudent(studentId)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Fee> updateFee(
            @PathVariable Long id,
            @Valid @RequestBody FeeRequestDto dto
    ) {
        return ResponseEntity.ok(feeService.updateFee(id, dto));
    }

    @PatchMapping("/{id}/payment")
    public ResponseEntity<Fee> recordPayment(
            @PathVariable Long id,
            @RequestBody Map<String, BigDecimal> request
    ) {
        return ResponseEntity.ok(
                feeService.recordPayment(id, request.get("amount"))
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFee(@PathVariable Long id) {
        feeService.deleteFee(id);
        return ResponseEntity.noContent().build();
    }
}