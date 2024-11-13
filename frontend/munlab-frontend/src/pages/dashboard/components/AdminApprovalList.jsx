import React, { useState, useEffect } from 'react';
import { Table, Badge, Button, Spinner } from 'react-bootstrap';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedAlert from '../../../components/AnimatedAlert';

const AdminApprovalList = () => {
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPendingAdmins();
  }, []);

  const fetchPendingAdmins = async () => {
    try {
      const response = await fetch('/api/users/pending-admins/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPendingAdmins(data);
      } else {
        throw new Error('Failed to fetch pending admins');
      }
    } catch (error) {
      setError('Errore nel caricamento delle richieste pending');
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (userId, approved) => {
    try {
      const response = await fetch(`/api/users/approve-admin/${userId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ approved })
      });

      if (response.ok) {
        setSuccess(`Amministratore ${approved ? 'approvato' : 'rifiutato'} con successo`);
        // Rimuovi l'admin dalla lista
        setPendingAdmins(prev => prev.filter(admin => admin.id !== userId));
        // Refresh della lista dopo 2 secondi
        setTimeout(() => {
          fetchPendingAdmins();
          setSuccess('');
        }, 2000);
      } else {
        throw new Error('Failed to approve admin');
      }
    } catch (error) {
      setError(`Errore nell'${approved ? 'approvazione' : 'rifiuto'} dell'amministratore`);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <AnimatedAlert
              variant="danger"
              onClose={() => setError('')}
              className="mb-4"
            >
              {error}
            </AnimatedAlert>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <AnimatedAlert
              variant="success"
              onClose={() => setSuccess('')}
              className="mb-4"
            >
              {success}
            </AnimatedAlert>
          </motion.div>
        )}
      </AnimatePresence>

      {pendingAdmins.length === 0 ? (
        <div className="text-center p-5 text-muted">
          <h5>Nessuna richiesta di approvazione in sospeso</h5>
        </div>
      ) : (
        <Table responsive hover>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Ruolo</th>
              <th>Dipartimento</th>
              <th>Data Richiesta</th>
              <th>Stato</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {pendingAdmins.map(admin => (
              <motion.tr
                key={admin.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <td>
                  <div className="fw-bold">{admin.first_name} {admin.last_name}</div>
                  <small className="text-muted">{admin.username}</small>
                </td>
                <td>{admin.email}</td>
                <td>{admin.role}</td>
                <td>{admin.department}</td>
                <td>{format(new Date(admin.created_at), 'dd/MM/yyyy HH:mm')}</td>
                <td>
                  <Badge bg="warning">In Attesa</Badge>
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => handleApproval(admin.id, true)}
                    >
                      Approva
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleApproval(admin.id, false)}
                    >
                      Rifiuta
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default AdminApprovalList;