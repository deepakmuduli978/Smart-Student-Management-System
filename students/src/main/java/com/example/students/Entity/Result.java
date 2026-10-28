package com.example.students.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "student_results",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_student_subject_exam",
                        columnNames = {"student_id", "subject", "exam_name"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Result {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(nullable = false)
    private String subject;

    @Column(name = "exam_name", nullable = false)
    private String examName;

    @Column(name = "marks_obtained", nullable = false)
    private Double marksObtained;

    @Column(name = "maximum_marks", nullable = false)
    private Double maximumMarks;

    @Column(name = "pass_marks", nullable = false)
    private Double passMarks;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public Double getPercentage() {
        if (maximumMarks == null || maximumMarks <= 0) {
            return 0.0;
        }

        return Math.round((marksObtained / maximumMarks) * 10000.0) / 100.0;
    }

    public String getResultStatus() {
        if (marksObtained == null || passMarks == null) {
            return "NOT_AVAILABLE";
        }

        return marksObtained >= passMarks ? "PASS" : "FAIL";
    }
}