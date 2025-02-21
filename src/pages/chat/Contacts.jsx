import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthStatus } from '../../redux/UserSlice';
import { useNavigate } from 'react-router-dom';
import styles from './Contact.module.css';
import { Container } from 'react-bootstrap';
import axios from 'axios';
import { IoArrowBack } from 'react-icons/io5'; // Import back icon
import API_BASE_URL from "../../config/config";


function Contacts({ contacts, changeChat }) {
  const dispatch = useDispatch();
  const { loggedIn, user, userId, userRole } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [currentSelected, setCurrentSelected] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
console.log("userid",userId)
console.log("contact",contacts)

  // Check authentication status on mount
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  // Fetch contacts based on user role
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const endpoint = userRole === 'mentor' ? `${API_BASE_URL}/api/auth/get-student` : `${API_BASE_URL}/api/auth/get-course`;
        const response = await axios.get(endpoint);
        setUsers(response.data || []);
        console.log("users",response.data)

      } catch (error) {
        console.error('Error fetching contacts:', error);
        setError('Failed to load contacts');
      } finally {
        setLoading(false);
      }
    };

    if (loggedIn) {
      fetchContacts();
    }
  }, [loggedIn, userRole]);

  // Redirect to login if not logged in
  useEffect(() => {
    if (!loggedIn) {
      navigate('/login');
    }
  }, [loggedIn, navigate]);

  // Handle chat change
  const handleChatChange = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  // Show loading state
  if (loading) {
    return <div className={styles.loading}>Loading contacts...</div>;
  }

  // Show error message if fetching contacts failed
  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  // Show no contacts message
  if (!contacts || contacts.length === 0) {
    return <div className={styles.noContacts}>No contacts available.</div>;
  }
  const handleback=()=>{
    if(userRole==="mentor"){
      navigate("/teachers")
    }else{
      navigate("/learners")
    }
  }
  return (
    loggedIn &&
    user && (
      <Container className={styles.container}>
       
        <div className={styles.brand}>
        <button className={styles.mainBackButton} onClick={handleback}>
          <IoArrowBack /> Back
        </button>
          <img src="/images/logo.png" alt="Logo" className={styles.logo} />
          <h3 className={styles.brandname}>SkillHub</h3>
        </div>

        <div className={styles.contactsList}>
          {contacts.length > 0 ? (
            contacts.map((contact, index) => {
              const isApprovedUser = users.some(
                (user) =>
                  (user.studentId === contact._id || user.teacherId === contact._id) && (userId===contact.teacherId ||userId===contact.studentId)&&
                  user.status === "approved"
              );

              return isApprovedUser ? (
                <div
                  key={contact._id || index}
                  className={`${styles.contactCard} ${currentSelected === index ? styles.selected : ''}`}
                  onClick={() => handleChatChange(index, contact)}
                >
                  <div className={styles.avatar}>
                    <img src={contact.photo || 'https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg'} alt={`${contact.name}'s Avatar`} className={styles.avatarImg} />
                  </div>
                  <div className={styles.userName}>
                    <h3 className={styles.name}>{contact.name}</h3>
                  </div>
                </div>
              ):null
            })
          ) : (
            <p>No contact available</p>
          )}
        </div>
      </Container>
    )
  );
}

export default Contacts;
