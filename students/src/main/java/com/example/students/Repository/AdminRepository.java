package com.example.students.Repository;

import com.example.students.Entity.Admin;
import com.example.students.Entity.Teacher;
import com.example.students.Entity.TeacherStatus;
import org.springframework.boot.json.JacksonJsonParser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin,Long> {

    Optional<Admin> findByEmail(String email);

    boolean existsByEmail(String email);
}
