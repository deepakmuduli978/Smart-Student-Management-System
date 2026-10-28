package com.example.students.Dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResultRequestDto {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotBlank(message = "Subject is required")
    @Size(max = 100)
    private String subject;

    @NotBlank(message = "Exam name is required")
    @Size(max = 100)
    private String examName;

    @NotNull(message = "Marks obtained is required")
    @PositiveOrZero(message = "Marks cannot be negative")
    private Double marksObtained;

    @NotNull(message = "Maximum marks is required")
    @Positive(message = "Maximum marks must be greater than zero")
    private Double maximumMarks;

    @NotNull(message = "Pass marks are required")
    @PositiveOrZero(message = "Pass marks cannot be negative")
    private Double passMarks;
}