import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button, Form, FormControl, Modal, Dropdown, DropdownButton } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import { FaCog, FaHome, FaBell } from 'react-icons/fa';  // Added icons
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthStatus, logout } from "../../redux/UserSlice";
import axios from 'axios';
import API_BASE_URL from "../../config/config";

const Header = () => {
  const dispatch = useDispatch();
  const { userId, username, userRole,loggedIn } = useSelector((state) => state.auth);
  console.log("header", userRole);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoginModal, setIsLoginModal] = useState(false);
  const data = ['Home', 'About', 'Courses', 'Features', 'Contact Us', 'Register', 'Login'];
  const [notificationCount, setNotificationCount] = useState(0); // ✅ Notification Count

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredResults(term ? data.filter((item) => item.toLowerCase().includes(term)) : []);
  };

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);
  
  const token = localStorage.getItem('token');

  function handleLogout() {
    dispatch(logout());
    navigate('/login');
  }

  const handleSignup = (userRole) => {
    setShowModal(false);
    if (userRole === 'learner') {
      navigate('/signup');
    } else {
      navigate('/teacher-signup');
    }
  };

  const handleLogin = (userRole) => {
    setShowModal(false);
    if (userRole === 'mentor') {
      navigate('/teacher-login');
    } else {
      navigate('/login');
    }
  };
  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId]);
  const fetchNotifications = async () => {
    try {
      if (!userId) return;

      const response = await axios.get(`${API_BASE_URL}/api/auth/get-notification`, {
        params: userRole === "learner" ? { studentId: userId } : { teacherId: userId },
      });

      setNotificationCount(response.data.length); // ✅ Set notification count
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };
  return (
    <Navbar expand="lg" bg="light" className="shadow sticky-top">
      <Container>
        {/* Logo with Text */}
        <Navbar.Brand href="/" className="d-flex flex-column align-items-center">
          <img 
            src="../../../images/logo.png"
            alt="Skill Hub Logo"
            style={{ height: '40px', width: 'auto' }}
          />
          <span className="text-muted" style={{ fontSize: '14px', fontStyle: 'italic' }}>
            Skill Hub
          </span>
        </Navbar.Brand>

        {/* Search Bar */}
        <Form className="d-flex mx-auto search-bar" style={{ flex: 1 }}>
          <FormControl
            type="search"
            placeholder="Search Here"
            className="rounded-search"
            value={searchTerm}
            onChange={handleSearch}
          />
        </Form>

        {/* Toggle Button */}
        {!loggedIn && <Navbar.Toggle aria-controls="basic-navbar-nav" />}

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {/* Replaced Home Button with Home Icon */}
            <Nav.Link onClick={() => navigate(userRole === "mentor" ? "/teachers" : "/learners")}>
  <FaHome style={{ fontSize: '1.2rem' }} />
</Nav.Link>

            
           {/* ✅ Notification Icon with Count */}
           <Nav.Link href="/notifications" className="position-relative">
              <FaBell style={{ fontSize: '1.2rem' }} />
              {notificationCount > 0 && (
                <span className="notification-badge">{notificationCount}</span>
              )}
            </Nav.Link>
          </Nav>

          {token ? (
            <>
              {/* Dropdown for settings */}
              <Dropdown>
                <DropdownButton
                  variant="link"
                  id="dropdown-custom-components"
                  title={<FaCog />} // Settings icon
                >
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </DropdownButton>
              </Dropdown>

              {/* Welcome Username */}
              <Nav.Link style={{ color: 'rgb(12, 80, 9)', fontWeight: 'bold' }}>
                Welcome, {username}
              </Nav.Link>
            </>
          ) : (
            <div className="d-flex flex-column flex-lg-row align-items-center ms-3">
              <Button
                variant="outline-success"
                className="me-2 mb-2 mb-lg-0"
                onClick={() => {
                  setShowModal(true);
                  setIsLoginModal(false); // For signup
                }}
              >
                Sign up
              </Button>
              <Button
                variant="success"
                onClick={() => {
                  setShowModal(true);
                  setIsLoginModal(true); // For login
                }}
              >
                Login
              </Button>
            </div>
          )}
        </Navbar.Collapse>
      </Container>

      {/* Search Results */}
      {searchTerm && (
        <div className="search-results bg-light shadow mt-2 p-3">
          {filteredResults.length > 0 ? (
            filteredResults.map((result, index) => (
              <div key={index} className="search-item">
                {result}
              </div>
            ))
          ) : (
            <div className="search-item text-muted">No results found</div>
          )}
          
        </div>
      )}
     {loggedIn && userRole ? (
  <div 
    className="mobile-home-icon d-lg-none"  
    onClick={() => navigate(userRole === "mentor" ? "/teachers" : "/learners")} 
    style={{ position: 'absolute', right: '5px', marginRight: "75px" }}
  > 
    <FaHome style={{ fontSize: '1.5rem', cursor: 'pointer' }} />
  </div>
) : null}

{/* 📌 Added Notification Icon for Mobile View */}
{loggedIn ? (
  <div 
    className="mobile-notification-icon d-lg-none"  
    onClick={() => navigate('/notifications')} 
    style={{ position: 'absolute', right: '5px', marginRight: "25px" }}
  > 
            {notificationCount > 0 && <span className="notification-badge">{notificationCount}</span>}

    <FaBell style={{ fontSize: '1.5rem', cursor: 'pointer' }} />
  </div>
) : null}

      {/* Modal for Login/Signup */}
      
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isLoginModal ? 'Login as' : 'Choose Your Role'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-around">
            {isLoginModal ? (
              <>
                <Button variant="outline-primary" onClick={() => handleLogin('learner')}>
                  Learner Login
                </Button>
                <Button variant="outline-primary" onClick={() => handleLogin('mentor')}>
                  Teacher Login
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline-primary" onClick={() => handleSignup('learner')}>
                  Learner Signup
                </Button>
                <Button variant="outline-primary" onClick={() => handleSignup('mentor')}>
                  Teacher Signup
                </Button>
              </>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </Navbar>
  );
};

export default Header;
