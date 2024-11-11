import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Button } from 'react-bootstrap';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Recupera le prenotazioni dal backend
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/prenotazioni/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        setBookings(response.data);
      } catch (error) {
        console.error("Errore durante il recupero delle prenotazioni:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const approveBooking = async (bookingId) => {
    try {
      await axios.patch(`http://127.0.0.1:8000/api/prenotazioni/${bookingId}/approve/`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: 'CON' } : b));
    } catch (error) {
      console.error("Errore durante l'approvazione della prenotazione:", error);
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/prenotazioni/${bookingId}/cancel/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      setBookings(bookings.filter(b => b.id !== bookingId));
    } catch (error) {
      console.error("Errore durante la cancellazione della prenotazione:", error);
    }
  };

  if (loading) {
    return <div>Caricamento...</div>;
  }

  return (
    <Container>
      <h1>Prenotazioni</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Utente</th>
            <th>Attività</th>
            <th>Data</th>
            <th>Stato</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.user.username}</td>
              <td>{booking.disponibilita.attivita.nome}</td>
              <td>{new Date(booking.disponibilita.data).toLocaleDateString()}</td>
              <td>{booking.status}</td>
              <td>
                {booking.status === 'ATT' && (
                  <>
                    <Button variant="success" onClick={() => approveBooking(booking.id)}>Approva</Button>{' '}
                    <Button variant="danger" onClick={() => cancelBooking(booking.id)}>Cancella</Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Bookings;
