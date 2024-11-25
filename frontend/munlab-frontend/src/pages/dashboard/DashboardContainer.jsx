// src/pages/dashboard/DashboardContainer.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DashboardContainer = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth'); // Se l'utente non è autenticato, reindirizza
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems =
    user?.user_type === 'admin'
      ? [
          { icon: 'ni ni-tv-2', text: 'Dashboard', link: '#' },
          { icon: 'ni ni-calendar-grid-58', text: 'Gestione Attività', link: '#' },
          { icon: 'ni ni-single-02', text: 'Prenotazioni Scuole', link: '#' },
          { icon: 'ni ni-bullet-list-67', text: 'Prenotazioni Visite', link: '#' },
        ]
      : [
          { icon: 'ni ni-calendar-grid-58', text: 'Calendario Attività', link: '#' },
          { icon: 'ni ni-cart', text: 'Le Mie Prenotazioni', link: '#' },
        ];

  return (
    <>
      {/* Background */}
      <div className="min-height-300 bg-primary position-absolute w-100"></div>

      {/* Sidebar */}
      <aside className="sidenav bg-white navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-4">
        <div className="sidenav-header">
          <i
            className="fas fa-times p-3 cursor-pointer text-secondary opacity-5 position-absolute end-0 top-0 d-none d-xl-none"
            onClick={() => setSidebarOpen(false)}
          ></i>
          <a className="navbar-brand m-0" href="#">
            <span className="ms-1 font-weight-bold">MunLab</span>
          </a>
        </div>
        <hr className="horizontal dark mt-0" />
        <div className="collapse navbar-collapse w-auto">
          <ul className="navbar-nav">
            {menuItems.map((item, index) => (
              <li className="nav-item" key={index}>
                <a className="nav-link" href={item.link}>
                  <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                    <i className={`${item.icon} text-primary text-sm opacity-10`}></i>
                  </div>
                  <span className="nav-link-text ms-1">{item.text}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="sidenav-footer mx-3">
          <button className="btn btn-danger btn-sm w-100 mb-3" onClick={handleLogout}>
            <i className="fa fa-sign-out me-2"></i> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content position-relative border-radius-lg">
        {/* Navbar */}
        <nav className="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl bg-white">
          <div className="container-fluid py-1 px-3">
            <nav aria-label="breadcrumb">
              <h6 className="font-weight-bolder mb-0">
                {user?.user_type === 'admin' ? 'Dashboard Operatore' : 'Dashboard Utente'}
              </h6>
            </nav>
            <div className="collapse navbar-collapse mt-sm-0 mt-2" id="navbar">
              <div className="ms-md-auto pe-md-3 d-flex align-items-center">
                <div className="input-group">
                  <span className="input-group-text text-body">
                    <i className="fas fa-search" aria-hidden="true"></i>
                  </span>
                  <input type="text" className="form-control" placeholder="Cerca..." />
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Dashboard Content */}
        <div className="container-fluid py-4">
          {user?.user_type === 'admin' ? (
            // Contenuto dashboard operatore
            <div className="row">
              <div className="col-xl-3 col-sm-6 mb-4">
                <div className="card">
                  <div className="card-body p-3">
                    <div className="row">
                      <div className="col-8">
                        <div className="numbers">
                          <p className="text-sm mb-0 text-uppercase font-weight-bold">Prenotazioni</p>
                          <h5 className="font-weight-bolder">10</h5>
                        </div>
                      </div>
                      <div className="col-4 text-end">
                        <div className="icon icon-shape bg-gradient-primary shadow-primary text-center rounded-circle">
                          <i className="ni ni-calendar-grid-58 text-lg opacity-10"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Altri widget */}
            </div>
          ) : (
            // Contenuto dashboard utente
            <div className="row">
              <div className="col-12">
                <div className="card mb-4">
                  <div className="card-header pb-0">
                    <h6>Prossime Attività</h6>
                  </div>
                  <div className="card-body px-0 pt-0 pb-2">
                    <div id="calendar"> {/* Qui puoi integrare FullCalendar */}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default DashboardContainer;
