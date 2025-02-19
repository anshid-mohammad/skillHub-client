import axios from 'axios';

const UseMessageService = () => {
  const fetchMessages = async (from, to) => {
    const { data } = await axios.post('/api/auth/get-messages', { from, to });
    return data;
  };

  const sendMessage = async ({ from, to, message, socket }) => {
    await axios.post('/api/auth/add-message', { from, to, message });
    socket.emit('send-msg', { to, from, message });
  };

  return { fetchMessages, sendMessage };
};

export default UseMessageService;