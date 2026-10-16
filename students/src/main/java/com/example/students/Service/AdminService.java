package com.example.students.Service;


import com.example.students.Dto.AdminDto;
import com.example.students.Entity.*;
import com.example.students.Repository.AdminRepository;
import com.example.students.Repository.StudentRepository;
import com.example.students.Repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    public Admin createAdmin(AdminDto dto) {

        if (adminRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Admin email already exists");
        }

        Admin admin = Admin.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .password(dto.getPassword())
                .role(Role.ADMIN)
                .build();

        return adminRepository.save(admin);
    }
    public List<Student> getPendingStudents() {
        return studentRepository.findByStatus(StudentStatus.PENDING);
    }
    public List<Teacher> getPendingTeachers() {
        return teacherRepository.findByStatus(TeacherStatus.PENDING);
    }
    public Student approveStudent(Integer id) {

        Student student = studentRepository.findById((long)id)
                .orElseThrow(() ->
                        new RuntimeException("Student not found"));

        student.setStatus(StudentStatus.APPROVED);


        return studentRepository.save(student);
    }
    public Student rejectStudent(Integer id) {

        Student student = studentRepository.findById((long)id)
                .orElseThrow(() ->
                        new RuntimeException("Student not found"));

        student.setStatus(StudentStatus.REJECTED);

        return studentRepository.save(student);
    }
    public Teacher approveTeacher(Integer id) {

        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Teacher not found"));

        teacher.setStatus(TeacherStatus.APPROVED);
        teacher.setActive(true);

        return teacherRepository.save(teacher);
    }
    public Teacher rejectTeacher(Integer id) {

        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Teacher not found"));

        teacher.setStatus(TeacherStatus.REJECTED);

        return teacherRepository.save(teacher);
    }
}