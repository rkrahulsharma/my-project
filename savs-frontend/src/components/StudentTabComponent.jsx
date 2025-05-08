import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './StudentTabComponent.css';

const StudentTabComponent = () => {
  const [students, setStudents] = useState([]);

  // Fetch pending students initially and after any action
  const fetchPendingStudents = () => {
    axios.get('http://localhost:5000/api/superadmin/pending-students')
      .then((res) => {
        setStudents(res.data);
      })
      .catch((err) => console.error('Error fetching students:', err));
  };

  useEffect(() => {
    fetchPendingStudents();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/superadmin/students/${id}/approve`);
      alert('Student approved');
      fetchPendingStudents(); // refresh list
    } catch (error) {
      console.error('Approval error:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/superadmin/students/${id}`);
      alert('Student rejected');
      fetchPendingStudents(); // refresh list
    } catch (error) {
      console.error('Rejection error:', error);
    }
  };

  return (
    <div className="student-tab">
      <h5>Pending Student Approvals</h5>
      {students.length === 0 ? (
        <p>No pending students</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Guardian Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.guardian_email}</td>
                <td>{student.is_approved ? 'Approved' : 'Pending'}</td>
                <td>
                  <button className="btn btn-success btn-sm me-2" onClick={() => handleApprove(student.id)}>Approve</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleReject(student.id)}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentTabComponent;
