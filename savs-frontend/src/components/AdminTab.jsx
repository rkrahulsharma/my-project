import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';

const AdminTab = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/superadmin/admins');
      setAdmins(res.data);
    } catch (err) {
      console.error("Error fetching admins:", err);
    }
    setLoading(false);
  };

  const approveAdmin = async (id) => {
    if (window.confirm("Are you sure you want to approve this admin?")) {
      try {
        await axios.put(`http://localhost:5000/api/superadmin/admins/${id}/approve`);
        fetchAdmins(); // Refresh list
      } catch (err) {
        console.error("Error approving admin:", err);
      }
    }
  };

  const rejectAdmin = async (id) => {
    if (window.confirm("Are you sure you want to reject/delete this admin?")) {
      try {
        await axios.delete(`http://localhost:5000/api/superadmin/admins/${id}`);
        fetchAdmins(); // Refresh list
      } catch (err) {
        console.error("Error rejecting admin:", err);
      }
    }
  };

  if (loading) {
    return <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>;
  }

  return (
    <div>
      <h5>Admins</h5>
      {admins.length === 0 ? (
        <Alert variant="info">No admins found.</Alert>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Dept</th>
              <th>College</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td>{admin.name}</td>
                <td>{admin.email}</td>
                <td>{admin.department}</td>
                <td>{admin.college}</td>
                <td>{admin.is_approved ? 'Approved' : 'Pending'}</td>
                <td>
                  {!admin.is_approved ? (
                    <>
                      <Button size="sm" variant="success" onClick={() => approveAdmin(admin.id)}>Approve</Button>{' '}
                      <Button size="sm" variant="danger" onClick={() => rejectAdmin(admin.id)}>Reject</Button>
                    </>
                  ) : (
                    <span>—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default AdminTab;