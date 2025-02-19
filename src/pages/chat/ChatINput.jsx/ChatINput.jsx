import React, { useState } from 'react';
import styles from './ChatINput.module.css';
import Picker from 'emoji-picker-react';
import { IoMdSend } from 'react-icons/io';
import { BsEmojiSmileFill } from 'react-icons/bs';

export default function ChatInput({ handleSendMsg }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [msg, setMsg] = useState('');

  // Toggle emoji picker visibility
  const handleEmojiPickerToggle = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  // Handle emoji click
  const handleEmojiClick = (emoji) => {
    setMsg((prev) => prev + emoji.emoji);
  };

  // Handle message send
  const sendChat = (event) => {
    event.preventDefault();
    if (msg.trim().length > 0) {
      handleSendMsg(msg);
      setMsg('');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.buttonContainer}>
        <BsEmojiSmileFill className={styles.emojiIcon} onClick={handleEmojiPickerToggle} />
        {showEmojiPicker && (
          <Picker
            className={styles.emojiPicker}
            onEmojiClick={handleEmojiClick}
            pickerStyle={{ width: '300px', height: '300px' }}
          />
        )}
      </div>

      <form className={styles.inputContainer} onSubmit={sendChat}>
        <input
          type="text"
          placeholder="Type a message..."
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          className={styles.innerInput}
        />
        <button type="submit" className={styles.submit}>
          <IoMdSend />
        </button>
      </form>
    </div>
  );
}