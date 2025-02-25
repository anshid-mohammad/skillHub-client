
import React, { useState, useEffect } from "react";
import {
  Navbar,
  Nav,
  Container,
  Button,
  Form,
  FormControl,
  Modal,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import { FaCog, FaHome, FaBell } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthStatus, logout } from "../../redux/UserSlice";

const Header = () => {
  const dispatch = useDispatch();
  const { userId, username, userRole } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoginModal, setIsLoginModal] = useState(false);

  const data = ["Home", "About", "Courses", "Features", "Contact Us", "Register", "Login"];

  const token = localStorage.getItem("token") || null;

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredResults(term ? data.filter((item) => item.toLowerCase().includes(term)) : []);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleRoleSelection = (role, isLogin) => {
    setShowModal(false);
    if (isLogin) {
      navigate(role === "mentor" ? "/teacher-login" : "/login");
    } else {
      navigate(role === "mentor" ? "/teacher-signup" : "/signup");
    }
  };

  return (
    <Navbar expand="lg" bg="light" className="shadow sticky-top">
      <Container>
        {/* Logo with Text */}
        <Navbar.Brand href="/" className="d-flex flex-column align-items-center">
          <img
            src="/images/logo.png"
            alt="Skill Hub Logo"
            style={{ height: "40px", width: "auto" }}
          />
          <span className="text-muted" style={{ fontSize: "14px", fontStyle: "italic" }}>
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
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link onClick={() => navigate(userRole ? (userRole === "mentor" ? "/teachers" : "/learners") : "/")}>
              <FaHome style={{ fontSize: "1.2rem" }} />
            </Nav.Link>
            <Nav.Link href="/notifications">
              <FaBell style={{ fontSize: "1.2rem" }} />
            </Nav.Link>
          </Nav>

          {token ? (
            <>
              <Dropdown>
                <DropdownButton
                  variant="link"
                  id="dropdown-custom-components"
                  title={<span><FaCog /></span>}
                >
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </DropdownButton>
              </Dropdown>
              <Nav.Link style={{ color: "rgb(9, 83, 20)", fontWeight: "bold" }}>
                Welcome, {username || "Guest"}
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
 <div className="mobile-home-icon d-lg-none"  onClick={() => navigate(userRole === "mentor" ? "/teachers" : "/learners")} style={{ position: 'absolute',  right: '5px',marginRight : "75px" }}> 
            <FaHome style={{ fontSize: '1.5rem', cursor: 'pointer' }} />
          </div>
      {/* Modal for Login/Signup */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isLoginModal ? "Login as" : "Choose Your Role"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-around">
            <Button variant="outline-primary" onClick={() => handleRoleSelection("learner", isLoginModal)}>
              {isLoginModal ? "Learner Login" : "Learner Signup"}
            </Button>
            <Button variant="outline-primary" onClick={() => handleRoleSelection("mentor", isLoginModal)}>
              {isLoginModal ? "Teacher Login" : "Teacher Signup"}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </Navbar>
  );
};

export default Header;
