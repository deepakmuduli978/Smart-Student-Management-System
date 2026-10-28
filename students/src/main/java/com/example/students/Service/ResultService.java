package com.example.students.Service;

import com.example.students.Dto.ResultRequestDto;
import com.example.students.Entity.Result;
import com.example.students.Entity.Student;
import com.example.students.Entity.StudentStatus;
import com.example.students.Repository.ResultRepository;
import com.example.students.Repository.StudentRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResultService {

    private final ResultRepository resultRepository;
    private final StudentRepository studentRepository;

    @Transactional
    public Result addResult(ResultRequestDto dto) {

        validateMarks(dto);

        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Student not found"
                ));

        if (student.getStatus() != StudentStatus.APPROVED) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Results can only be added for approved students"
            );
        }

        boolean exists = resultRepository
                .existsByStudentIdAndSubjectIgnoreCaseAndExamNameIgnoreCase(
                        dto.getStudentId(),
                        dto.getSubject().trim(),
                        dto.getExamName().trim()
                );

        if (exists) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Result already exists for this subject and exam"
            );
        }

        Result result = Result.builder()
                .student(student)
                .subject(dto.getSubject().trim())
                .examName(dto.getExamName().trim())
                .marksObtained(dto.getMarksObtained())
                .maximumMarks(dto.getMaximumMarks())
                .passMarks(dto.getPassMarks())
                .build();

        return resultRepository.save(result);
    }

    @Transactional(readOnly = true)
    public List<Result> getAllResults() {
        return resultRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Result getResultById(Long id) {
        return resultRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Result not found"
                ));
    }

    @Transactional(readOnly = true)
    public List<Result> getResultsByStudent(Long studentId) {

        if (!studentRepository.existsById(studentId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Student not found"
            );
        }

        return resultRepository.findByStudentId(studentId);
    }

    @Transactional
    public Result updateResult(Long id, ResultRequestDto dto) {

        validateMarks(dto);

        Result result = resultRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Result not found"
                ));

        if (result.getStudent().getId() != dto.getStudentId()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Student ID cannot be changed when updating a result"
            );
        }

        result.setSubject(dto.getSubject().trim());
        result.setExamName(dto.getExamName().trim());
        result.setMarksObtained(dto.getMarksObtained());
        result.setMaximumMarks(dto.getMaximumMarks());
        result.setPassMarks(dto.getPassMarks());

        return resultRepository.save(result);
    }

    @Transactional
    public void deleteResult(Long id) {

        if (!resultRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Result not found"
            );
        }

        resultRepository.deleteById(id);
    }

    private void validateMarks(ResultRequestDto dto) {

        if (dto.getMarksObtained() == null
                || dto.getMaximumMarks() == null
                || dto.getPassMarks() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "All marks fields are required"
            );
        }

        if (!Double.isFinite(dto.getMarksObtained())
                || !Double.isFinite(dto.getMaximumMarks())
                || !Double.isFinite(dto.getPassMarks())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Marks must be finite numbers"
            );
        }

        if (dto.getMaximumMarks() <= 0
                || dto.getMarksObtained() < 0
                || dto.getMarksObtained() > dto.getMaximumMarks()
                || dto.getPassMarks() < 0
                || dto.getPassMarks() > dto.getMaximumMarks()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Marks must be within the valid range"
            );
        }
    }
}