import React from 'react';
import styles from "./Welcome.module.css";

export default function Welcome({ contacts }) {
  if (!contacts || contacts.length === 0) {
    return null; // Ensure contacts exist before rendering
  }

  return (
    <div className={styles.container}>
      {/* Chat-related Image */}
      <img src="../../../images/chat.png" alt="Welcome to Chat" className={styles.chatImage} />

      <h1 className={styles.welcomeHeader}>
        Welcome, <span>{contacts[0].name}</span>
      </h1>
      <h3 className={styles.welcomesub}>Please select a chat to start messaging</h3>
    </div>
  );
}
