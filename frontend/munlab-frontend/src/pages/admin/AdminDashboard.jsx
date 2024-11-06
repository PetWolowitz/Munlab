// src/pages/admin/AdminDashboard.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalActivities: 0,
    totalBookings: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Funzione per recuperare le statistiche
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(response.data);
      } catch (error) {
        console.error("Errore nel recupero delle statistiche:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <p>Caricamento della dashboard in corso...</p>;
  }

  return (
    <div className="container mt-4">
      <h2>Dashboard Amministrativa</h2>
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Attività Totali</h5>
              <p className="card-text">{stats.totalActivities}</p>
              <Link to="/activities" className="btn btn-primary">
                Gestisci Attività
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Prenotazioni Totali</h5>
              <p className="card-text">{stats.totalBookings}</p>
              <Link to="/bookings" className="btn btn-primary">
                Visualizza Prenotazioni
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Utenti Registrati</h5>
              <p className="card-text">{stats.totalUsers}</p>
              <Link to="/users" className="btn btn-primary">
                Gestisci Utenti
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
