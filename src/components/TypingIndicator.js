import React from 'react';
import './TypingIndicator.css';

const TypingIndicator = () => {
  return (
    <div className="message message-assistant">
      <div className="typing-indicator">
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
      </div>
    </div>
  );
};

export default TypingIndicator;
