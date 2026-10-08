package com.example.students.Repository;


import com.example.students.Entity.Student;
import com.example.students.Entity.StudentStatus;
import com.example.students.Entity.Teacher;
import com.example.students.Entity.TeacherStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TeacherRepository extends JpaRepository<Teacher, Integer> {

    Optional<Teacher> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    List<Teacher> findByStatus(TeacherStatus status);
}
