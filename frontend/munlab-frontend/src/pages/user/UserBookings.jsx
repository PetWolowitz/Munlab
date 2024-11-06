// src/pages/user/UserBookings.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Funzione per recuperare le prenotazioni dell'utente
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('/api/user/bookings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(response.data);
      } catch (error) {
        console.error("Errore nel recupero delle prenotazioni:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return <p>Caricamento delle prenotazioni in corso...</p>;
  }

  if (bookings.length === 0) {
    return <p>Nessuna prenotazione trovata.</p>;
  }

  return (
    <div className="container mt-4">
      <h2>Le Mie Prenotazioni</h2>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Titolo</th>
            <th>Data</th>
            <th>Stato</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.title}</td>
              <td>{new Date(booking.date).toLocaleDateString()}</td>
              <td>{booking.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserBookings;
