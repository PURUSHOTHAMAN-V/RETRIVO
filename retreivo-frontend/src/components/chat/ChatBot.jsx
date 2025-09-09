import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { FiSend, FiMessageCircle, FiX } from 'react-icons/fi'
import './ChatBot.css' // We'll create this file next

export default function ChatBot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch chat history when component mounts
  useEffect(() => {
    if (user && isOpen) {
      fetchChatHistory();
    } else if (isOpen) {
      // For non-authenticated users, show a welcome message
      setChatHistory([
        { message_id: 1, content: 'Hello! I\'m here to help with anything you need. Feel free to ask about Retreivo or any other topic!', is_bot: true, created_at: new Date().toISOString() },
      ]);
    }
  }, [user, isOpen]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChatHistory = async () => {
    try {
      setLoading(true);
      // Mock chat history for now
      const mockHistory = [
        { message_id: 1, content: 'Hello! I\'m here to help with anything you need. Feel free to ask about Retreivo or any other topic!', is_bot: true, created_at: new Date().toISOString() },
      ];
      setChatHistory(mockHistory);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // Add user message to chat
    const userMessage = {
      message_id: Date.now(),
      content: message,
      is_bot: false,
      created_at: new Date().toISOString()
    };

    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');
    setLoading(true);

    try {
      // Mock bot response
      setTimeout(() => {
        let botResponse = '';
        
        // Retreivo-specific responses
        if (message.toLowerCase().includes('lost') || message.toLowerCase().includes('missing')) {
          botResponse = 'To report a lost item, please go to the "Report Lost Item" section and provide details about your item.';
        } else if (message.toLowerCase().includes('found')) {
          botResponse = 'Thank you for finding an item! Please go to the "Report Found Item" section to help return it to its owner.';
        } else if (message.toLowerCase().includes('reward') || message.toLowerCase().includes('points')) {
          botResponse = 'You can earn rewards by helping return lost items to their owners. Check your rewards balance in the "Rewards" section.';
        } else if (message.toLowerCase().includes('claim')) {
          botResponse = 'If you see your lost item in the search results, you can claim it by clicking the "Claim" button on the item.';
        } 
        // General responses
        else if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
          botResponse = 'Hello! I\'m here to help with anything you need. Feel free to ask me about Retreivo or any other topic.';
        } else if (message.toLowerCase().includes('weather')) {
          botResponse = 'I don\'t have real-time weather data, but I can suggest checking a weather app or website for the most accurate forecast.';
        } else if (message.toLowerCase().includes('time')) {
          botResponse = `The current time is ${new Date().toLocaleTimeString()}.`;
        } else if (message.toLowerCase().includes('date')) {
          botResponse = `Today's date is ${new Date().toLocaleDateString()}.`;
        } else if (message.toLowerCase().includes('joke')) {
          const jokes = [
            'Why don\'t scientists trust atoms? Because they make up everything!',
            'What do you call a fake noodle? An impasta!',
            'Why did the scarecrow win an award? Because he was outstanding in his field!',
            'I told my wife she was drawing her eyebrows too high. She looked surprised.',
            'What do you call a bear with no teeth? A gummy bear!'
          ];
          botResponse = jokes[Math.floor(Math.random() * jokes.length)];
        } else if (message.toLowerCase().includes('thank')) {
          botResponse = 'You\'re welcome! Is there anything else I can help you with?';
        } else if (message.toLowerCase().includes('name')) {
          botResponse = 'I\'m the Smart Assistant! I can help with Retreivo features and general questions too!';
        } else if (message.toLowerCase().includes('how are you')) {
          botResponse = 'I\'m doing well, thank you for asking! How can I assist you today?';
        } else if (message.toLowerCase().includes('bye') || message.toLowerCase().includes('goodbye')) {
          botResponse = 'Goodbye! Feel free to chat again if you need any help.';
        } else if (message.toLowerCase().includes('help')) {
          botResponse = 'I can help with Retreivo features like reporting lost items, finding items, or claiming rewards. I can also answer general questions, tell jokes, or just chat!';
        } else if (message.toLowerCase().includes('what can you do')) {
          botResponse = 'I can answer questions about Retreivo, tell you the time and date, share jokes, provide general information, and chat with you about various topics!';
        } else if (message.toLowerCase().includes('who made you') || message.toLowerCase().includes('who created you')) {
          botResponse = 'I was created by the Retreivo development team to help users with both Retreivo-specific questions and general inquiries.';
        } else if (message.toLowerCase().includes('calculate') || message.toLowerCase().includes('math')) {
          botResponse = 'I can help with basic calculations! Just type your math question clearly, like "what is 5 + 3?" or "calculate 10 * 4".';
        } else if (message.toLowerCase().includes('music') || message.toLowerCase().includes('song')) {
          botResponse = 'I can\'t play music directly, but I can recommend some great music apps or websites where you can listen to your favorite songs!';
        } else if (message.toLowerCase().includes('movie') || message.toLowerCase().includes('film')) {
          botResponse = 'I love movies! I can recommend some popular films or tell you about the latest releases if you\'re interested.';
        } else if (message.toLowerCase().includes('food') || message.toLowerCase().includes('recipe')) {
          botResponse = 'I can suggest some delicious recipes or recommend food options based on your preferences. What kind of cuisine are you interested in?';
        } else if (message.toLowerCase().includes('book') || message.toLowerCase().includes('read')) {
          botResponse = 'Reading is wonderful! I can recommend books from various genres or discuss popular authors if you\'d like some reading suggestions.';
        } else if (message.toLowerCase().includes('sport') || message.toLowerCase().includes('game')) {
          botResponse = 'Sports are exciting! I can chat about different sports, recent games, or popular teams. Which sport interests you the most?';
        } else if (message.toLowerCase().includes('travel') || message.toLowerCase().includes('vacation')) {
          botResponse = 'Traveling is a great way to explore new places and cultures! I can suggest popular destinations or travel tips if you\'re planning a trip.';
        } else if (message.toLowerCase().includes('technology') || message.toLowerCase().includes('tech')) {
          botResponse = 'Technology is fascinating! I can discuss the latest tech trends, gadgets, or answer questions about specific technologies you\'re interested in.';
        } else if (message.toLowerCase().includes('health') || message.toLowerCase().includes('fitness')) {
          botResponse = 'Health and fitness are important! I can share general wellness tips, exercise suggestions, or information about maintaining a healthy lifestyle.';
        } else if (message.toLowerCase().includes('education') || message.toLowerCase().includes('learn')) {
          botResponse = 'Learning is a lifelong journey! I can suggest educational resources, discuss various subjects, or help you find information on topics you want to learn about.';
        } else {
          // General fallback response
          botResponse = 'I\'m here to help with both Retreivo features and general questions. Feel free to ask me about lost items, rewards, or anything else you\'re curious about!';
        }

        const botMessageObj = {
          message_id: Date.now() + 1,
          content: botResponse,
          is_bot: true,
          created_at: new Date().toISOString()
        };

        setChatHistory(prev => [...prev, botMessageObj]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Remove the user check to make the chatbot visible for all users
  // if (!user) return null;

  return (
    <div className="chatbot-container">
      {/* Chat toggle button */}
      <button 
        className="chat-toggle-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chat"
      >
        {isOpen ? <FiX size={24} /> : <FiMessageCircle size={24} />}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>Smart Assistant</h3>
            <button onClick={() => setIsOpen(false)} className="close-button">
              <FiX size={18} />
            </button>
          </div>
          <div className="chat-messages">
            {chatHistory.map((chat) => (
              <div 
                key={chat.message_id} 
                className={`message ${chat.is_bot ? 'bot' : 'user'}`}
              >
                <div className="message-content">{chat.content}</div>
              </div>
            ))}
            {loading && <div className="message bot"><div className="loading-dots"><span>.</span><span>.</span><span>.</span></div></div>}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-input">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              disabled={loading}
            />
            <button 
              onClick={handleSendMessage} 
              disabled={!message.trim() || loading}
              className="send-button"
            >
              <FiSend size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}