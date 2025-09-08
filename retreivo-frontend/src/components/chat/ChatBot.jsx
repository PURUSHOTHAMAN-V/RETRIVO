import React, { useState, useEffect, useRef } from 'react';
import { sendChatMessage, getChatHistory } from '../../services/api';
import { FiSend, FiMessageSquare, FiX } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const { isAuthenticated } = useAuth();

  // Fetch chat history when component mounts and chat is opened
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchChatHistory();
    }
  }, [isOpen, isAuthenticated]);

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChatHistory = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      setError('');
      const response = await getChatHistory();
      if (response.ok && response.messages) {
        setMessages(response.messages);
      }
    } catch (err) {
      setError('Failed to load chat history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !isAuthenticated) return;

    try {
      setLoading(true);
      setError('');
      
      // Add user message to UI immediately
      const userMessage = {
        message_id: Date.now(),
        content: message,
        is_bot: false,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, userMessage]);
      setMessage('');
      
      // Send message to API
      const response = await sendChatMessage(message);
      if (response.ok && response.message) {
        // Add bot response from API
        setMessages(prev => [...prev, response.message]);
      }
    } catch (err) {
      setError('Failed to send message');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 1000
    }}>
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}
      >
        {isOpen ? <FiX size={24} /> : <FiMessageSquare size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          bottom: '80px',
          right: '0',
          width: '350px',
          height: '500px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Chat Header */}
          <div style={{
            padding: '16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            fontWeight: '600',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>Retreivo Assistant</span>
            <button
              onClick={toggleChat}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Messages Container */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {loading && messages.length === 0 && (
              <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                Loading messages...
              </div>
            )}

            {error && (
              <div style={{ 
                textAlign: 'center', 
                padding: '10px', 
                color: '#ef4444',
                backgroundColor: '#fee2e2',
                borderRadius: '8px'
              }}>
                {error}
              </div>
            )}

            {!isAuthenticated && (
              <div style={{ 
                textAlign: 'center', 
                padding: '20px', 
                color: '#6b7280',
                backgroundColor: '#f3f4f6',
                borderRadius: '8px'
              }}>
                Please log in to use the chat assistant.
              </div>
            )}

            {messages.length === 0 && !loading && isAuthenticated && (
              <div style={{ 
                textAlign: 'center', 
                padding: '20px', 
                color: '#6b7280' 
              }}>
                Start a conversation with our assistant.
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.message_id}
                style={{
                  maxWidth: '80%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  backgroundColor: msg.is_bot ? '#f3f4f6' : '#3b82f6',
                  color: msg.is_bot ? '#111827' : 'white',
                  alignSelf: msg.is_bot ? 'flex-start' : 'flex-end',
                  wordBreak: 'break-word'
                }}
              >
                {msg.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          {isAuthenticated && (
            <form
              onSubmit={handleSendMessage}
              style={{
                display: 'flex',
                padding: '12px',
                borderTop: '1px solid #e5e7eb'
              }}
            >
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '24px',
                  outline: 'none',
                  marginRight: '8px'
                }}
              />
              <button
                type="submit"
                disabled={!message.trim() || loading}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: message.trim() && !loading ? 'pointer' : 'not-allowed',
                  opacity: message.trim() && !loading ? 1 : 0.7
                }}
              >
                <FiSend size={18} />
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatBot;