package com.example.students.Repository;

import com.example.students.Entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository
        extends JpaRepository<Attendance, Long> {

    List<Attendance> findByAttendanceDate(LocalDate attendanceDate);

    List<Attendance> findByStudentId(Long studentId);

    List<Attendance> findByStudentIdAndAttendanceDateBetween(
            Long studentId,
            LocalDate startDate,
            LocalDate endDate
    );

    Optional<Attendance> findByStudentIdAndAttendanceDate(
            Long studentId,
            LocalDate attendanceDate
    );

    long countByStudentIdAndStatusAndAttendanceDateBetween(
            Long studentId,
            com.example.students.Entity.AttendanceStatus status,
            LocalDate startDate,
            LocalDate endDate
    );
}