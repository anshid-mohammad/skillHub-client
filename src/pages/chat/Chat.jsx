import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Container } from 'react-bootstrap';
import { checkAuthStatus } from '../../redux/UserSlice';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Contacts from './Contacts';
import Welcome from './welcome/Welcome';
import styles from './Chat.module.css';
import ChatContainer from './ChatContainer';
import { io } from 'socket.io-client';
import API_BASE_URL from "../../config/config";

function Chat() {
  const socket = useRef();
  const dispatch = useDispatch();
  const { loggedIn, user, userId, userRole } = useSelector((state) => state.auth);
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  // const host = 'http://localhost:5000';
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  useEffect(() => {
    if (!loggedIn || !user) {
      navigate('/login');
    }
  }, [loggedIn, user, navigate]);

  useEffect(() => {
    if (user) {
      socket.current = io(API_BASE_URL, { withCredentials: true });
      socket.current.emit('add-user', userId);
      return () => socket.current && socket.current.disconnect();
    }
  }, [userId, user]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const endpoint = userRole === 'mentor' ? `${API_BASE_URL}/api/auth/get-user`: `${API_BASE_URL}/api/auth/get-ventor`;
        const response = await axios.get(endpoint);
        setContacts(response.data);
      } catch (error) {
        console.error('Error fetching contacts:', error);
        setError('Failed to load contacts');
      } finally {
        setLoading(false);
      }
    };

    if (loggedIn && user) fetchContacts();
  }, [loggedIn, user, userRole]);

  const handleChatChange = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);


useEffect(() => {
  const handleResize = () => setIsMobile(window.innerWidth <= 768);
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
  return (
    <Container>
      {/* <div className={styles.header}>
      <button className={styles.mainbackButton} onClick={handleback}>
          <IoArrowBack /> Back
        </button>
     
      </div> */}

      <div className={styles.container}>
      <div className={`${styles.contactsList} ${isMobile && currentChat ? styles.hidden : ''}`}>

        <Contacts contacts={contacts} changeChat={handleChatChange} />
</div>
        {loading ? (
          <div>Loading contacts...</div>
        ) : error ? (
          <div>{error}</div>
        ) : currentChat === undefined ? (
          <Welcome contacts={contacts} />
        ) : (
          <ChatContainer currentChat={currentChat} socket={socket}  onBackClick={() => setCurrentChat(undefined)} />
        )}
      </div>
    </Container>
  );
}

export default Chat;
