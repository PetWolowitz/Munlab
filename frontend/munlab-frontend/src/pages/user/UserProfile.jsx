// src/pages/user/UserProfile.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserProfile = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    description: '',
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    // Funzione per ottenere i dati dell'utente
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Errore nel recupero del profilo utente:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.put('/api/user/profile', userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditing(false);
      alert("Profilo aggiornato con successo!");
    } catch (error) {
      console.error("Errore nell'aggiornamento del profilo:", error);
      alert("Si è verificato un errore durante l'aggiornamento del profilo.");
    }
  };

  if (loading) {
    return <p>Caricamento del profilo in corso...</p>;
  }

  return (
    <div className="container mt-4">
      <h2>Profilo Utente</h2>
      <div className="mt-3">
        <label>Nome:</label>
        <input
          type="text"
          name="name"
          className="form-control"
          value={userData.name}
          onChange={handleInputChange}
          disabled={!editing}
        />
      </div>
      <div className="mt-3">
        <label>Email:</label>
        <input
          type="email"
          name="email"
          className="form-control"
          value={userData.email}
          onChange={handleInputChange}
          disabled
        />
      </div>
      <div className="mt-3">
        <label>Descrizione:</label>
        <textarea
          name="description"
          className="form-control"
          rows="3"
          value={userData.description}
          onChange={handleInputChange}
          disabled={!editing}
        ></textarea>
      </div>
      <div className="mt-4">
        {editing ? (
          <button className="btn btn-success me-2" onClick={handleSave}>
            Salva
          </button>
        ) : (
          <button className="btn btn-primary me-2" onClick={() => setEditing(true)}>
            Modifica
          </button>
        )}
        {editing && (
          <button className="btn btn-secondary" onClick={() => setEditing(false)}>
            Annulla
          </button>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
