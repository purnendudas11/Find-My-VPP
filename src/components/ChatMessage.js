import React from 'react';
import './ChatMessage.css';

const ChatMessage = ({ message, isUser }) => {
  const formatTime = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className={`message ${isUser ? 'message-user' : 'message-assistant'}`}>
      <div>
        <div className={`message-bubble`}>
          {message.content || message.text}
        </div>
        {message.timestamp && (
          <div className="message-time">
            {formatTime(message.timestamp)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
