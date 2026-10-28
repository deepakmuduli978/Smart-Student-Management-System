package com.example.students.Repository;

import com.example.students.Entity.Result;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResultRepository extends JpaRepository<Result, Long> {

    List<Result> findByStudentId(Long studentId);

    boolean existsByStudentIdAndSubjectIgnoreCaseAndExamNameIgnoreCase(
            Long studentId,
            String subject,
            String examName
    );
}