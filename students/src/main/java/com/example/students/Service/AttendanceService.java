package com.example.students.Service;

import com.example.students.Dto.AttendanceRequestDto;
import com.example.students.Entity.Attendance;
import com.example.students.Entity.AttendanceStatus;
import com.example.students.Entity.Student;
import com.example.students.Entity.StudentStatus;
import com.example.students.Repository.AttendanceRepository;
import com.example.students.Repository.StudentRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;

    @Transactional
    public Attendance markAttendance(AttendanceRequestDto dto) {

        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Student not found"
                ));

        if (student.getStatus() != StudentStatus.APPROVED) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Attendance can only be marked for approved students"
            );
        }

        LocalDate date = dto.getAttendanceDate();

        if (date.isAfter(LocalDate.now())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Attendance date cannot be in the future"
            );
        }

        Attendance attendance = attendanceRepository
                .findByStudentIdAndAttendanceDate(
                        dto.getStudentId(), date
                )
                .orElseGet(Attendance::new);

        attendance.setStudent(student);
        attendance.setAttendanceDate(date);
        attendance.setStatus(dto.getStatus());

        return attendanceRepository.save(attendance);
    }

    @Transactional(readOnly = true)
    public List<Attendance> getAttendanceByDate(LocalDate date) {

        return attendanceRepository.findByAttendanceDate(date);
    }

    @Transactional(readOnly = true)
    public List<Attendance> getStudentAttendance(Long studentId) {

        if (!studentRepository.existsById(studentId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Student not found"
            );
        }

        return attendanceRepository.findByStudentId(studentId);
    }

    @Transactional(readOnly = true)
    public List<Attendance> getStudentAttendanceBetweenDates(
            Long studentId,
            LocalDate startDate,
            LocalDate endDate
    ) {

        if (!studentRepository.existsById(studentId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Student not found"
            );
        }

        if (startDate.isAfter(endDate)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Start date must not be after end date"
            );
        }

        return attendanceRepository
                .findByStudentIdAndAttendanceDateBetween(
                        studentId, startDate, endDate
                );
    }

    @Transactional(readOnly = true)
    public double getAttendancePercentage(
            Long studentId,
            LocalDate startDate,
            LocalDate endDate
    ) {

        if (!studentRepository.existsById(studentId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Student not found"
            );
        }

        if (startDate.isAfter(endDate)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Start date must not be after end date"
            );
        }

        long present = attendanceRepository
                .countByStudentIdAndStatusAndAttendanceDateBetween(
                        studentId,
                        AttendanceStatus.PRESENT,
                        startDate,
                        endDate
                );

        long total = attendanceRepository
                .findByStudentIdAndAttendanceDateBetween(
                        studentId, startDate, endDate
                )
                .size();

        if (total == 0) {
            return 0.0;
        }

        return Math.round((present * 10000.0) / total) / 100.0;
    }
}