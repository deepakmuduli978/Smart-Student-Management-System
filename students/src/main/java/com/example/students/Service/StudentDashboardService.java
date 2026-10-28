package com.example.students.Service;

import com.example.students.Dto.StudentDashboardResponseDto;
import com.example.students.Entity.Attendance;
import com.example.students.Entity.Fee;
import com.example.students.Entity.Result;
import com.example.students.Entity.Student;
import com.example.students.Repository.AttendanceRepository;
import com.example.students.Repository.FeeRepository;
import com.example.students.Repository.ResultRepository;
import com.example.students.Repository.StudentRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class StudentDashboardService {

    private final StudentRepository studentRepository;
    private final AttendanceRepository attendanceRepository;
    private final ResultRepository resultRepository;
    private final FeeRepository feeRepository;

    public StudentDashboardService(
            StudentRepository studentRepository,
            AttendanceRepository attendanceRepository,
            ResultRepository resultRepository,
            FeeRepository feeRepository) {

        this.studentRepository = studentRepository;
        this.attendanceRepository = attendanceRepository;
        this.resultRepository = resultRepository;
        this.feeRepository = feeRepository;
    }

    @Transactional(readOnly = true)
    public StudentDashboardResponseDto getDashboard(Long studentId) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Student not found"));

        StudentDashboardResponseDto dto = new StudentDashboardResponseDto();

        // Student profile
        dto.setStudentId(student.getId());
        dto.setName(student.getName());
        dto.setEmail(student.getEmail());
        dto.setRollNo(student.getRollNo());
        dto.setDepartment(student.getDepartment());
        dto.setCourse(student.getCourse());
        dto.setSemester(student.getSemester());
        dto.setStatus(
                student.getStatus() == null
                        ? null
                        : student.getStatus().name());

        // Attendance statistics
        List<Attendance> attendance =
                attendanceRepository.findByStudentId(studentId);

        long totalAttendance = attendance.size();

        long presentAttendance = attendance.stream()
                .filter(record -> record.getStatus() != null
                        && record.getStatus().name().equals("PRESENT"))
                .count();

        double attendancePercentage = totalAttendance == 0
                ? 0.0
                : (presentAttendance * 100.0) / totalAttendance;

        dto.setTotalAttendance(totalAttendance);
        dto.setPresentAttendance(presentAttendance);
        dto.setAttendancePercentage(round(attendancePercentage));

        // Result statistics
        List<Result> results = resultRepository.findByStudentId(studentId);

        double averagePercentage = results.stream()
                .filter(result ->
                        result.getMaximumMarks() != null &&
                                result.getMaximumMarks() > 0 &&
                                result.getMarksObtained() != null
                )
                .mapToDouble(result ->
                        (result.getMarksObtained() * 100.0)
                                / result.getMaximumMarks()
                )
                .average()
                .orElse(0.0);

        dto.setTotalSubjects(results.size());
        dto.setAveragePercentage(round(averagePercentage));

        // Fee statistics
        List<Fee> fees = feeRepository.findByStudent_Id(studentId);

        BigDecimal totalFees = fees.stream()
                .map(Fee::getTotalAmount)
                .filter(amount -> amount != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal paidFees = fees.stream()
                .map(Fee::getPaidAmount)
                .filter(amount -> amount != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        dto.setTotalFees(totalFees);
        dto.setPaidFees(paidFees);
        dto.setPendingFees(totalFees.subtract(paidFees));

        return dto;
    }

    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}