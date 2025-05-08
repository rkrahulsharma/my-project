// src/components/PendingStudents.jsx
import React from 'react';
import { Card, Button, Table } from 'react-bootstrap';

const PendingStudents = () => {
  // Dummy static data for now
  const students = [
    { id: 1, name: 'Arjun R', email: 'arjun@example.com', dept: 'CSE', college: 'RGCET' },
    { id: 2, name: 'Sneha M', email: 'sneha@example.com', dept: 'CSE', college: 'RGCET' },
  ];

  return (
    <Card>
      <Card.Header>Pending Student Requests</Card.Header>
      <Card.Body>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>College</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((stu) => (
              <tr key={stu.id}>
                <td>{stu.name}</td>
                <td>{stu.email}</td>
                <td>{stu.dept}</td>
                <td>{stu.college}</td>
                <td>
                  <Button variant="success" size="sm" className="me-2">Accept</Button>
                  <Button variant="danger" size="sm">Reject</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default PendingStudents;
