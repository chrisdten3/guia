import React, { useState } from 'react';
import './chatInterface.css'; // Add some custom styling

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  // Handles message submission
  const sendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput(''); // Clear input field
      // Simulate bot reply after a short delay
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "This is a bot's response!", sender: 'bot' }
        ]);
      }, 1000);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-display">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            {message.text}
          </div>
        ))}
      </div>

      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Guia about the codebase"
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button className = "submit-text" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatInterface;