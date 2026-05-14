import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';

const Chat = ({ messages, isLoading, onSendMessage }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const input = e.target.elements.message;
    const text = input.value.trim();
    
    if (text && !isLoading) {
      onSendMessage(text);
      input.value = '';
    }
  };

  return (
    <div className="chat-section">
      {/* Header */}
      <div className="chat-header">
        <h2>Vehicle Protection Assistant</h2>
      </div>

      {/* Messages Container */}
      <div className="messages-container">
        {messages.length === 0 && !isLoading ? (
          <div className="chat-empty-state">
            <h2>Welcome to Find My VPP</h2>
            <p>I'm here to help you find the perfect Vehicle Protection Products for your vehicle. Let's start with a few questions!</p>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <ChatMessage 
                key={idx} 
                message={msg} 
                isUser={msg.isUser}
              />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Form */}
      <form className="message-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="message"
          className="message-input"
          placeholder="Type your answer or ask a question..."
          disabled={isLoading}
          maxLength={500}
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={isLoading}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
