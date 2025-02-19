import React, { useEffect, useState, useRef } from 'react';
import styles from './ChatContainer.module.css';
import { Container } from 'react-bootstrap';
import ChatINput from './ChatINput.jsx/ChatINput'; // Fixed typo: ChatINput -> ChatInput
import axios from 'axios';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { IoArrowBack } from 'react-icons/io5'; // Import back icon

export default function ChatContainer({ currentChat, socket,onBackClick }) {
  const [messages, setMessages] = useState([]); // Messages state
  const { userId, userRole } = useSelector((state) => state.auth); // Redux state
  const [arrivalMessage, setArrivalMessage] = useState(null); // Incoming messages
  const scrollRef = useRef(); // Ref for scrolling to the latest message
  const [selectedImage, setSelectedImage] = useState(null); // Modal image state

  // Fetch messages for the current chat
  useEffect(() => {
    const fetchMessages = async () => {
      if (currentChat) {
        try {
          const { data } = await axios.post('/api/auth/get-message', {
            from: userId,
            to: currentChat._id,
          });
          setMessages(data); // Set fetched messages
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      }
    };

    fetchMessages();
  }, [currentChat, userId]);

  // Handle sending a message
  const handleSendMsg = async (msg) => {
    if (!msg.trim()) return; // Ignore empty messages

    const newMessage = {
      fromSelf: true,
      message: msg,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]); // Add message to local state

    try {
      const { data } = await axios.post('/api/auth/add-message', {
        from: userId,
        to: currentChat._id,
        message: msg,
        timestamp: new Date().toISOString(),
      });

      if (data.msg === 'Message added successfully') {
        // Emit the message via socket
        socket.current.emit('send-msg', {
          to: currentChat._id,
          from: userId,
          message: msg,
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Listen for incoming messages
  useEffect(() => {
    if (!socket.current) return;

    const handleMessageReceive = (msg) => {
      setArrivalMessage({ fromSelf: false, message: msg }); // Set incoming message
    };

    socket.current.on('msg-receive', handleMessageReceive);

    // Cleanup socket listener
    return () => {
      socket.current.off('msg-receive', handleMessageReceive);
    };
  }, [socket]);

  // Add arrival message to the messages list
  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage]);

  // Scroll to the latest message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  const closeModal = () => {
    setSelectedImage(null); // Close modal by clearing selected image
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl); // Show the clicked image in modal
  };
  const handleBackchat = () => {
    if (onBackClick) {
      onBackClick(); // Call parent function to reset currentChat
    }
  }
  return (
    <Container className={styles.container}>
      {/* Chat Header */}
      <div className={styles.chatheader}>
      <button className={styles.backButton} onClick={handleBackchat}>
          <IoArrowBack /> Back
        </button>
        <div className={styles.userDetails}>
          <div className={styles.avatar}>
            <img
              className={styles.imageAvatar}
              src={currentChat.photo || 'https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg'}
              alt={`${currentChat.name}'s Avatar`}
              onClick={() => handleImageClick(currentChat.photo || '/default-avatar.png')} // Handle image click

            />
          </div>
          <div className={styles.username}>
            <h3>{currentChat.name}</h3>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className={styles.chatMessages}>
        {messages.length > 0 ? (
          messages.map((message) => (
            <div
              ref={scrollRef}
              key={uuidv4()} // Unique key for each message
              className={`${styles.message} ${
                message.fromSelf ? styles.sended : styles.received
              }`}
            >
              <div className={styles.content}>
                <p>{message.message}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No messages to display.</p>
        )}
         {/* Modal for displaying the selected image */}
              {selectedImage && (
                <div className={styles.modal} onClick={closeModal}>
                  <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                    <img src={selectedImage} alt="Selected" className={styles.modalImage} />
                    <button className={styles.closeButton} onClick={closeModal}>
                      &times; {/* This represents the "X" symbol */}
                    </button>
                  </div>
                </div>
              )}
      </div>

      {/* Chat Input */}
      <ChatINput handleSendMsg={handleSendMsg} />
    </Container>
  );
}