package com.example.students.Repository;

import com.example.students.Entity.Student;
import com.example.students.Entity.StudentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Boolean existsByEmail(String email);
    Boolean existsByRollNo(String rollNo);
    List<Student> findByStatus(StudentStatus status);
}
