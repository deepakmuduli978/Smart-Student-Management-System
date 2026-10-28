package com.example.students.Repository;

import com.example.students.Entity.Fee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeeRepository extends JpaRepository<Fee, Long> {

    List<Fee> findByStudent_Id(Long studentId);

    boolean existsByStudent_IdAndAcademicYearAndFeeType(
            Long studentId,
            String academicYear,
            String feeType
    );
}