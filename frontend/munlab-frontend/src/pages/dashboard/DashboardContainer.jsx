import React, { useState } from 'react';
import { Container, Row, Col, Nav, Button, Image, Dropdown } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  FaCalendarAlt, 
  FaTicketAlt, 
  FaUserCircle, 
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaCog,
  FaBell
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
// import Calendar from './components/Calendar';
// import ActivityList from './components/ActivityList';
// import ProfileSection from './components/ProfileSection';
// import NotificationCenter from './components/NotificationCenter';
// import { generateRandomAvatar } from '../../utils/avatarUtils';
import './Dashboard.css';

const DashboardContainer = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeSection, setActiveSection] = useState('calendar');
  const { user, logout } = useAuth();
  const [avatar] = useState(generateRandomAvatar());

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'calendar':
        return <Calendar />;
      case 'bookings':
        return <ActivityList />;
      case 'profile':
        return <ProfileSection />;
      default:
        return <Calendar />;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <motion.div 
        className={`sidebar ${showSidebar ? 'show' : 'hide'}`}
        initial={{ x: -250 }}
        animate={{ x: showSidebar ? 0 : -250 }}
      >
        {/* Logo e Brand */}
        <div className="sidebar-header">
          <h3>MunLab</h3>
          <Button 
            variant="link" 
            className="sidebar-toggle"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            {showSidebar ? <FaTimes /> : <FaBars />}
          </Button>
        </div>

        {/* User Profile Preview */}
        <div className="user-preview">
          <Image 
            src={avatar} 
            roundedCircle 
            className="profile-image"
          />
          <div className="user-info">
            <h6>{user?.firstName} {user?.lastName}</h6>
            <small className="text-muted">{user?.email}</small>
          </div>
        </div>

        {/* Navigation */}
        <Nav className="flex-column mt-4">
          <Nav.Link 
            active={activeSection === 'calendar'}
            onClick={() => setActiveSection('calendar')}
          >
            <FaCalendarAlt /> Calendario
          </Nav.Link>
          <Nav.Link 
            active={activeSection === 'bookings'}
            onClick={() => setActiveSection('bookings')}
          >
            <FaTicketAlt /> Prenotazioni
          </Nav.Link>
          <Nav.Link 
            active={activeSection === 'profile'}
            onClick={() => setActiveSection('profile')}
          >
            <FaUserCircle /> Profilo
          </Nav.Link>
        </Nav>

        {/* Logout Button */}
        <Button 
          variant="link" 
          className="logout-button"
          onClick={handleLogout}
        >
          <FaSignOutAlt /> Logout
        </Button>
      </motion.div>

      {/* Main Content */}
      <div className={`main-content ${showSidebar ? 'with-sidebar' : 'full-width'}`}>
        {/* Top Navigation */}
        <nav className="top-nav">
          <Button 
            variant="link" 
            className="menu-button d-md-none"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <FaBars />
          </Button>

          <div className="nav-right">
            {/* Notifications */}
            <Dropdown>
              <Dropdown.Toggle variant="link" className="notification-bell">
                <FaBell />
                <span className="notification-badge">3</span>
              </Dropdown.Toggle>
              <Dropdown.Menu align="end">
                <NotificationCenter />
              </Dropdown.Menu>
            </Dropdown>

            {/* User Menu */}
            <Dropdown>
              <Dropdown.Toggle variant="link" className="user-menu">
                <Image src={avatar} roundedCircle className="mini-profile" />
              </Dropdown.Toggle>
              <Dropdown.Menu align="end">
                <Dropdown.Item onClick={() => setActiveSection('profile')}>
                  <FaUserCircle /> Profilo
                </Dropdown.Item>
                <Dropdown.Item>
                  <FaCog /> Impostazioni
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>
                  <FaSignOutAlt /> Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </nav>

        {/* Content Area */}
        <Container fluid className="content-area">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {renderContent()}
          </motion.div>
        </Container>
      </div>
    </div>
  );
};

export default DashboardContainer;