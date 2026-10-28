
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import '../styles/Fees.css';

const Fees = () => {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);

  const initialForm = {
    studentId: '',
    feeType: 'Tuition Fee',
    academicYear: '2026-2027',
    totalAmount: '',
    paidAmount: '0',
    dueDate: ''
  };

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');

    try {
      const [feesResponse, studentsResponse] = await Promise.all([
        api.get('/fees'),
        api.get('/students/getall')
      ]);

      setFees(
        Array.isArray(feesResponse.data) ? feesResponse.data : []
      );

      const studentList = Array.isArray(studentsResponse.data)
        ? studentsResponse.data
        : [];

      setStudents(
        studentList.filter(
          student =>
            (student.status ?? student.Status)?.toUpperCase() === 'APPROVED'
        )
      );
    } catch (err) {
      console.error('Fee loading error:', err);
      setError(
        err.response?.data?.message ||
        'Unable to load fees. Check your backend and API endpoints.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = event => {
    const { name, value } = event.target;

    setForm(previous => ({
      ...previous,
      [name]: value
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async event => {
    event.preventDefault();

    setError('');
    setSuccess('');

    const total = Number(form.totalAmount);
    const paid = Number(form.paidAmount);

    if (!form.studentId) {
      setError('Please select a student.');
      return;
    }

    if (!Number.isFinite(total) || total <= 0) {
      setError('Total fee must be greater than zero.');
      return;
    }

    if (!Number.isFinite(paid) || paid < 0 || paid > total) {
      setError('Paid amount must be between zero and the total fee.');
      return;
    }

    const payload = {
      ...form,
      studentId: Number(form.studentId),
      totalAmount: total,
      paidAmount: paid
    };

    try {
      if (editingId !== null) {
        await api.put(`/fees/${editingId}`, payload);
        setSuccess('Fee record updated successfully.');
      } else {
        await api.post('/fees', payload);
        setSuccess('Fee assigned successfully.');
      }

      setForm(initialForm);
      setEditingId(null);
      await loadData();
    } catch (err) {
      console.error('Fee save error:', err);
      setError(
        err.response?.data?.message ||
        err.response?.data?.detail ||
        'Unable to save the fee record.'
      );
    }
  };

  const handleEdit = fee => {
    setEditingId(fee.id);

    setForm({
      studentId: String(fee.student?.id ?? fee.studentId ?? ''),
      feeType: fee.feeType ?? '',
      academicYear: fee.academicYear ?? '',
      totalAmount: String(fee.totalAmount ?? ''),
      paidAmount: String(fee.paidAmount ?? 0),
      dueDate: fee.dueDate ?? ''
    });

    setError('');
    setSuccess('');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePayment = async fee => {
    const pending = Number(fee.totalAmount) - Number(fee.paidAmount);

    if (pending <= 0) {
      setError('This fee has already been paid in full.');
      return;
    }

    const input = window.prompt(
      `Pending amount: ₹${pending.toFixed(2)}\nEnter the payment amount:`
    );

    if (input === null) return;

    const amount = Number(input);

    if (!Number.isFinite(amount) || amount <= 0 || amount > pending) {
      setError('Enter a valid payment amount within the pending balance.');
      return;
    }

    try {
      setError('');
      setSuccess('');

      await api.patch(`/fees/${fee.id}/payment`, { amount });

      setSuccess('Payment recorded successfully.');
      await loadData();
    } catch (err) {
      console.error('Payment error:', err);
      setError(
        err.response?.data?.message ||
        'Unable to record payment.'
      );
    }
  };

  const handleDelete = async id => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this fee record?'
    );

    if (!confirmed) return;

    try {
      setError('');
      setSuccess('');

      await api.delete(`/fees/${id}`);

      setSuccess('Fee record deleted successfully.');
      await loadData();
    } catch (err) {
      console.error('Fee deletion error:', err);
      setError(
        err.response?.data?.message ||
        'Unable to delete the fee record.'
      );
    }
  };

  const getStudentName = fee => {
    const student = fee.student;

    if (typeof student === 'string') return student;

    return student?.name ??
      fee.studentName ??
      `Student #${student?.id ?? fee.studentId ?? 'Unknown'}`;
  };

  const getStudentRoll = fee => {
    const student = fee.student;

    if (typeof student === 'object' && student !== null) {
      return student.rollNo ?? '—';
    }

    return fee.rollNo ?? '—';
  };

  const getStatus = fee => {
    const total = Number(fee.totalAmount ?? 0);
    const paid = Number(fee.paidAmount ?? 0);

    if (paid >= total && total > 0) return 'PAID';
    if (paid > 0) return 'PARTIAL';
    return 'PENDING';
  };

  const money = amount =>
    `₹${Number(amount ?? 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;

  const totalFees = fees.reduce(
    (sum, fee) => sum + Number(fee.totalAmount ?? 0),
    0
  );

  const totalPaid = fees.reduce(
    (sum, fee) => sum + Number(fee.paidAmount ?? 0),
    0
  );

  const totalPending = totalFees - totalPaid;

  const filteredFees = fees.filter(fee => {
    const query = search.toLowerCase();

    return (
      getStudentName(fee).toLowerCase().includes(query) ||
      getStudentRoll(fee).toLowerCase().includes(query) ||
      String(fee.feeType ?? '').toLowerCase().includes(query) ||
      String(fee.academicYear ?? '').toLowerCase().includes(query)
    );
  });

  return (
    <div className="fees-page">
      <header className="fees-header">
        <div>
          <span className="fees-eyebrow">STUDENT MANAGEMENT SYSTEM</span>
          <h1>Fee Management</h1>
          <p>Manage student fees, payments, and outstanding balances.</p>
        </div>

        <button className="fees-refresh" onClick={loadData} disabled={loading}>
          {loading ? 'Loading...' : '↻ Refresh'}
        </button>
      </header>

      {error && (
        <div className="fees-alert fees-alert-error" role="alert">
          {error}
          <button onClick={() => setError('')} aria-label="Dismiss error">
            ×
          </button>
        </div>
      )}

      {success && (
        <div className="fees-alert fees-alert-success" role="status">
          {success}
          <button onClick={() => setSuccess('')} aria-label="Dismiss message">
            ×
          </button>
        </div>
      )}

      <section className="fees-summary">
        <article className="fees-summary-card fees-total">
          <span className="fees-summary-icon">₹</span>
          <div>
            <p>Total Fees</p>
            <h2>{money(totalFees)}</h2>
          </div>
        </article>

        <article className="fees-summary-card fees-collected">
          <span className="fees-summary-icon">✓</span>
          <div>
            <p>Total Collected</p>
            <h2>{money(totalPaid)}</h2>
          </div>
        </article>

        <article className="fees-summary-card fees-pending">
          <span className="fees-summary-icon">◷</span>
          <div>
            <p>Total Pending</p>
            <h2>{money(totalPending)}</h2>
          </div>
        </article>

        <article className="fees-summary-card fees-records">
          <span className="fees-summary-icon">▤</span>
          <div>
            <p>Fee Records</p>
            <h2>{fees.length}</h2>
          </div>
        </article>
      </section>

      <section className="fees-panel">
        <div className="fees-section-heading">
          <div>
            <h2>{editingId !== null ? 'Update Fee' : 'Assign New Fee'}</h2>
            <p>
              {editingId !== null
                ? 'Update the selected fee record.'
                : 'Assign an academic fee to an approved student.'}
            </p>
          </div>
        </div>

        <form className="fees-form" onSubmit={handleSubmit}>
          <div className="fees-form-grid">
            <div className="fees-field">
              <label htmlFor="studentId">Student *</label>
              <select
                id="studentId"
                name="studentId"
                value={form.studentId}
                onChange={handleChange}
                required
                disabled={editingId !== null}
              >
                <option value="">Select a student</option>

                {students.map(student => (
                  <option
                    key={student.id ?? student.Id}
                    value={student.id ?? student.Id}
                  >
                    {student.name ?? student.Name}
                    {' — '}
                    {student.rollNo ?? student.RollNo ?? 'No roll number'}
                  </option>
                ))}
              </select>

              {students.length === 0 && (
                <small>No approved students available.</small>
              )}
            </div>

            <div className="fees-field">
              <label htmlFor="feeType">Fee Type *</label>
              <select
                id="feeType"
                name="feeType"
                value={form.feeType}
                onChange={handleChange}
                required
              >
                <option value="Tuition Fee">Tuition Fee</option>
                <option value="Admission Fee">Admission Fee</option>
                <option value="Examination Fee">Examination Fee</option>
                <option value="Library Fee">Library Fee</option>
                <option value="Hostel Fee">Hostel Fee</option>
                <option value="Laboratory Fee">Laboratory Fee</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="fees-field">
              <label htmlFor="academicYear">Academic Year *</label>
              <input
                id="academicYear"
                name="academicYear"
                value={form.academicYear}
                onChange={handleChange}
                placeholder="2026-2027"
                maxLength={20}
                required
              />
            </div>

            <div className="fees-field">
              <label htmlFor="totalAmount">Total Fee (₹) *</label>
              <input
                id="totalAmount"
                name="totalAmount"
                type="number"
                min="0.01"
                step="0.01"
                value={form.totalAmount}
                onChange={handleChange}
                placeholder="50000"
                required
              />
            </div>

            <div className="fees-field">
              <label htmlFor="paidAmount">Initial Paid Amount (₹) *</label>
              <input
                id="paidAmount"
                name="paidAmount"
                type="number"
                min="0"
                step="0.01"
                value={form.paidAmount}
                onChange={handleChange}
                placeholder="0"
                required
              />
            </div>

            <div className="fees-field">
              <label htmlFor="dueDate">Due Date</label>
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                value={form.dueDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="fees-form-actions">
            <button
              type="submit"
              className="fees-button fees-button-primary"
              disabled={loading}
            >
              {editingId !== null ? 'Update Fee' : 'Assign Fee'}
            </button>

            {editingId !== null && (
              <button
                type="button"
                className="fees-button fees-button-secondary"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="fees-panel fees-table-panel">
        <div className="fees-section-heading fees-table-heading">
          <div>
            <h2>Fee Records</h2>
            <p>Review payments and outstanding balances.</p>
          </div>

          <input
            className="fees-search"
            type="search"
            placeholder="Search student, roll no, fee..."
            value={search}
            onChange={event => setSearch(event.target.value)}
            aria-label="Search fee records"
          />
        </div>

        <div className="fees-table-wrapper">
          <table className="fees-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Student</th>
                <th>Fee Type</th>
                <th>Academic Year</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Pending</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="10" className="fees-empty">
                    Loading fee records...
                  </td>
                </tr>
              ) : filteredFees.length === 0 ? (
                <tr>
                  <td colSpan="10" className="fees-empty">
                    No fee records found.
                  </td>
                </tr>
              ) : (
                filteredFees.map(fee => {
                  const pending = Math.max(
                    0,
                    Number(fee.totalAmount ?? 0) -
                      Number(fee.paidAmount ?? 0)
                  );

                  const status = getStatus(fee);

                  return (
                    <tr key={fee.id}>
                      <td>#{fee.id}</td>

                      <td>
                        <div className="fees-student-name">
                          {getStudentName(fee)}
                        </div>
                        <small>{getStudentRoll(fee)}</small>
                      </td>

                      <td>{fee.feeType}</td>
                      <td>{fee.academicYear}</td>
                      <td>{money(fee.totalAmount)}</td>
                      <td className="fees-paid-text">
                        {money(fee.paidAmount)}
                      </td>
                      <td className="fees-pending-text">{money(pending)}</td>

                      <td>
                        <span
                          className={`fees-status fees-status-${status.toLowerCase()}`}
                        >
                          {status}
                        </span>
                      </td>

                      <td>{fee.dueDate || '—'}</td>

                      <td>
                        <div className="fees-row-actions">
                          {status !== 'PAID' && (
                            <button
                              type="button"
                              className="fees-action-pay"
                              onClick={() => handlePayment(fee)}
                            >
                              Pay
                            </button>
                          )}

                          <button
                            type="button"
                            className="fees-action-edit"
                            onClick={() => handleEdit(fee)}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="fees-action-delete"
                            onClick={() => handleDelete(fee.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="fees-table-footer">
          Showing {filteredFees.length} of {fees.length} fee records
        </div>
      </section>
    </div>
  );
};

export default Fees;

