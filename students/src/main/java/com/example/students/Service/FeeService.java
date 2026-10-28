package com.example.students.Service;

import com.example.students.Dto.FeeRequestDto;
import com.example.students.Entity.Fee;
import com.example.students.Entity.PaymentStatus;
import com.example.students.Entity.Student;
import com.example.students.Repository.FeeRepository;
import com.example.students.Repository.StudentRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@Service
public class FeeService {

    private final FeeRepository feeRepository;
    private final StudentRepository studentRepository;

    public FeeService(
            FeeRepository feeRepository,
            StudentRepository studentRepository
    ) {
        this.feeRepository = feeRepository;
        this.studentRepository = studentRepository;
    }

    @Transactional
    public Fee createFee(FeeRequestDto dto) {

        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Student not found"
                ));

        if (student.getStatus() == null ||
                !student.getStatus().name().equals("APPROVED")) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Fees can only be assigned to approved students"
            );
        }

        validateAmounts(dto.getTotalAmount(), dto.getPaidAmount());

        if (feeRepository.existsByStudent_IdAndAcademicYearAndFeeType(
                dto.getStudentId(),
                dto.getAcademicYear(),
                dto.getFeeType())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "This fee has already been assigned for this academic year"
            );
        }

        Fee fee = new Fee();
        fee.setStudent(student);
        fee.setFeeType(dto.getFeeType().trim());
        fee.setAcademicYear(dto.getAcademicYear().trim());
        fee.setTotalAmount(dto.getTotalAmount());
        fee.setPaidAmount(dto.getPaidAmount());
        fee.setDueDate(dto.getDueDate());

        updatePaymentStatus(fee);

        return feeRepository.save(fee);
    }

    @Transactional(readOnly = true)
    public List<Fee> getAllFees() {
        return feeRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Fee getFeeById(Long id) {
        return feeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Fee record not found"
                ));
    }

    @Transactional(readOnly = true)
    public List<Fee> getFeesByStudent(Long studentId) {

        if (!studentRepository.existsById(studentId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Student not found"
            );
        }

        return feeRepository.findByStudent_Id(studentId);
    }

    @Transactional
    public Fee updateFee(Long id, FeeRequestDto dto) {

        Fee fee = getFeeById(id);

        if (fee.getStudent().getId()!=(dto.getStudentId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Changing the student of an existing fee is not allowed"
            );
        }

        validateAmounts(dto.getTotalAmount(), dto.getPaidAmount());

        fee.setFeeType(dto.getFeeType().trim());
        fee.setAcademicYear(dto.getAcademicYear().trim());
        fee.setTotalAmount(dto.getTotalAmount());
        fee.setPaidAmount(dto.getPaidAmount());
        fee.setDueDate(dto.getDueDate());

        updatePaymentStatus(fee);

        return feeRepository.save(fee);
    }

    @Transactional
    public Fee recordPayment(Long id, BigDecimal amount) {

        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Payment amount must be greater than zero"
            );
        }

        Fee fee = getFeeById(id);

        BigDecimal newPaidAmount = fee.getPaidAmount().add(amount);

        if (newPaidAmount.compareTo(fee.getTotalAmount()) > 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Payment exceeds the pending fee amount"
            );
        }

        fee.setPaidAmount(newPaidAmount);
        updatePaymentStatus(fee);

        return feeRepository.save(fee);
    }

    @Transactional
    public void deleteFee(Long id) {

        Fee fee = getFeeById(id);
        feeRepository.delete(fee);
    }

    private void validateAmounts(
            BigDecimal totalAmount,
            BigDecimal paidAmount
    ) {
        if (totalAmount == null ||
                totalAmount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Total amount must be greater than zero"
            );
        }

        if (paidAmount == null ||
                paidAmount.compareTo(BigDecimal.ZERO) < 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Paid amount cannot be negative"
            );
        }

        if (paidAmount.compareTo(totalAmount) > 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Paid amount cannot exceed total amount"
            );
        }
    }

    private void updatePaymentStatus(Fee fee) {

        if (fee.getPaidAmount().compareTo(fee.getTotalAmount()) == 0) {
            fee.setPaymentStatus(PaymentStatus.PAID);
        } else if (fee.getPaidAmount().compareTo(BigDecimal.ZERO) > 0) {
            fee.setPaymentStatus(PaymentStatus.PARTIAL);
        } else {
            fee.setPaymentStatus(PaymentStatus.PENDING);
        }
    }
}