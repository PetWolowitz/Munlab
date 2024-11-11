import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const AdminApprovalPanel = () => {
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchPendingAdmins = async () => {
    try {
      const response = await axios.get('/api/users/pending-admins/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      setPendingAdmins(response.data);
    } catch (err) {
      setError('Errore nel caricamento delle richieste pending');
    }
  };

  const handleApprove = async (userId) => {
    try {
      await axios.post(`/api/users/approve-admin/${userId}/`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      setSuccess('Admin approvato con successo');
      fetchPendingAdmins(); // Ricarica la lista
    } catch (err) {
      setError('Errore nell\'approvazione dell\'admin');
    }
  };

  useEffect(() => {
    fetchPendingAdmins();
  }, []);

  return (
    <Card>
      <Card.Body>
        <Card.Title>Approvazioni Admin Pending</Card.Title>
        
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Ruolo</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {pendingAdmins.map((admin) => (
              <tr key={admin.id}>
                <td>{`${admin.first_name} ${admin.last_name}`}</td>
                <td>{admin.email}</td>
                <td>{admin.user_type}</td>
                <td>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleApprove(admin.id)}
                  >
                    Approva
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default AdminApprovalPanel;