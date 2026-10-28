package com.example.students.Dto;

import java.math.BigDecimal;

public class StudentDashboardResponseDto {

    private Long studentId;
    private String name;
    private String email;
    private String rollNo;
    private String department;
    private String course;
    private Integer semester;
    private String status;

    private long totalAttendance;
    private long presentAttendance;
    private double attendancePercentage;

    private long totalSubjects;
    private double averagePercentage;

    private BigDecimal totalFees = BigDecimal.ZERO;
    private BigDecimal paidFees = BigDecimal.ZERO;
    private BigDecimal pendingFees = BigDecimal.ZERO;

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRollNo() {
        return rollNo;
    }

    public void setRollNo(String rollNo) {
        this.rollNo = rollNo;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public Integer getSemester() {
        return semester;
    }

    public void setSemester(Integer semester) {
        this.semester = semester;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public long getTotalAttendance() {
        return totalAttendance;
    }

    public void setTotalAttendance(long totalAttendance) {
        this.totalAttendance = totalAttendance;
    }

    public long getPresentAttendance() {
        return presentAttendance;
    }

    public void setPresentAttendance(long presentAttendance) {
        this.presentAttendance = presentAttendance;
    }

    public double getAttendancePercentage() {
        return attendancePercentage;
    }

    public void setAttendancePercentage(double attendancePercentage) {
        this.attendancePercentage = attendancePercentage;
    }

    public long getTotalSubjects() {
        return totalSubjects;
    }

    public void setTotalSubjects(long totalSubjects) {
        this.totalSubjects = totalSubjects;
    }

    public double getAveragePercentage() {
        return averagePercentage;
    }

    public void setAveragePercentage(double averagePercentage) {
        this.averagePercentage = averagePercentage;
    }

    public BigDecimal getTotalFees() {
        return totalFees;
    }

    public void setTotalFees(BigDecimal totalFees) {
        this.totalFees = totalFees;
    }

    public BigDecimal getPaidFees() {
        return paidFees;
    }

    public void setPaidFees(BigDecimal paidFees) {
        this.paidFees = paidFees;
    }

    public BigDecimal getPendingFees() {
        return pendingFees;
    }

    public void setPendingFees(BigDecimal pendingFees) {
        this.pendingFees = pendingFees;
    }
}