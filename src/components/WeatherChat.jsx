import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Sparkles,
  Send,
  X,
  Bot,
  User,
  RotateCcw,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { sendChatMessage } from '../services/aiService';
import { formatTemperature } from '../utils/formatWeatherData';

const SUGGESTED_PROMPTS = [
  '🌧️ Do I need an umbrella today?',
  '🚴 Is it safe to ride my bike right now?',
  '👗 What should I wear today?',
  '🏃 Best time for outdoor workout?',
  '☀️ UV & sun protection advice',
  '📅 3-day forecast summary'
];

/**
 * Simple, secure lightweight markdown renderer for chat bubbles
 */
const FormattedMarkdown = ({ text }) => {
  if (!text) return null;

  // Split lines
  const lines = text.split('\n');

  return (
    <div className="chat-markdown-body">
      {lines.map((line, lineIdx) => {
        if (!line.trim()) {
          return <div key={`empty-${lineIdx}`} style={{ height: '0.45rem' }} />;
        }

        // Header ###
        if (line.startsWith('### ')) {
          return (
            <h4 key={`h3-${lineIdx}`} style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0.4rem 0 0.2rem 0', color: 'var(--accent-color)' }}>
              {line.replace('### ', '')}
            </h4>
          );
        }

        // Bullet point • or -
        const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
        const cleanLine = isBullet ? line.replace(/^[•\-]\s*/, '') : line;

        // Parse bold **text** and italic *text*
        const parts = cleanLine.split(/(\*\*.*?\*\*|\*.*?\*)/g);

        const renderedContent = parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={`b-${pIdx}`} style={{ fontWeight: 700, color: '#fff' }}>{part.slice(2, -2)}</strong>;
          }
          if (part.startsWith('*') && part.endsWith('*')) {
            return <em key={`i-${pIdx}`} style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.85)' }}>{part.slice(1, -1)}</em>;
          }
          return part;
        });

        if (isBullet) {
          return (
            <div key={`bullet-${lineIdx}`} style={{ display: 'flex', gap: '0.45rem', marginLeft: '0.25rem', marginBottom: '0.2rem' }}>
              <span style={{ color: 'var(--primary-color)' }}>•</span>
              <span>{renderedContent}</span>
            </div>
          );
        }

        return <p key={`p-${lineIdx}`} style={{ margin: '0.2rem 0' }}>{renderedContent}</p>;
      })}
    </div>
  );
};

export const WeatherChat = ({ weather, location, tempUnit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [errorToast, setErrorToast] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Initial welcome greeting
  useEffect(() => {
    if (weather && messages.length === 0) {
      const initialGreeting = `👋 Hi there! I'm your **Aether AI Meteorologist** for **${location.name}**.\n\n` +
        `Current conditions: **${formatTemperature(weather.current?.temperature, tempUnit)}** (${weather.current?.condition}), ` +
        `humidity at **${Math.round(weather.current?.humidity || 50)}%**, wind at **${Math.round(weather.current?.windSpeed || 0)} km/h**.\n\n` +
        `Ask me anything about outdoor activities, rain timings, outfit choices, or 7-day trends!`;

      setMessages([
        {
          id: 'welcome-1',
          sender: 'ai',
          text: initialGreeting,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [weather, location, tempUnit]);

  // Handle send message
  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || isTyping) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setIsTyping(true);
    setErrorToast(null);

    try {
      const aiReply = await sendChatMessage({
        messages: newHistory,
        weather,
        location,
        tempUnit
      });

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setErrorToast('AI Chat is temporarily unavailable. Please try again.');
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: '⚠️ I encountered an error retrieving that analysis. Please try asking again in a moment.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleResetChat = () => {
    const initialGreeting = `🔄 Conversation reset. How can I help you with the weather in **${location.name}** today?`;
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'ai',
        text: initialGreeting,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setErrorToast(null);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          className="chat-floating-btn glass-card"
          onClick={() => {
            setIsOpen(true);
            setHasUnread(false);
          }}
          title="Open AI Weather Analyst"
          aria-label="Open AI Weather Analyst"
        >
          <div className="chat-btn-icon">
            <Sparkles size={20} className="sparkle-anim" />
          </div>
          <span className="chat-btn-text">Weather AI Chat</span>
          {hasUnread && <span className="chat-unread-dot" />}
        </button>
      )}

      {/* Slide-in Chat Panel */}
      {isOpen && (
        <div className="chat-drawer-container glass-card">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar-icon">
                <Bot size={20} />
              </div>
              <div>
                <div className="chat-header-title">
                  <span>Aether AI Meteorologist</span>
                  <span className="chat-live-tag">LIVE</span>
                </div>
                <div className="chat-header-sub">
                  Grounded in {location.name} telemetry • {formatTemperature(weather?.current?.temperature, tempUnit)}
                </div>
              </div>
            </div>

            <div className="chat-header-actions">
              <button
                className="chat-tool-btn"
                onClick={handleResetChat}
                title="New Chat / Reset Conversation"
              >
                <RotateCcw size={15} />
              </button>
              <button
                className="chat-tool-btn"
                onClick={() => setIsOpen(false)}
                title="Close Chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Error Toast if active */}
          {errorToast && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.25)',
              borderBottom: '1px solid rgba(239, 68, 68, 0.4)',
              padding: '0.5rem 1rem',
              fontSize: '0.8rem',
              color: '#FEF2F2',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              <AlertCircle size={14} color="#EF4444" />
              <span>{errorToast}</span>
            </div>
          )}

          {/* Quick Prompt Suggestions */}
          <div className="chat-suggestions-bar">
            {SUGGESTED_PROMPTS.map((promptText, idx) => (
              <button
                key={`prompt-${idx}`}
                className="chat-suggestion-chip"
                onClick={() => handleSendMessage(promptText)}
                disabled={isTyping}
              >
                {promptText}
              </button>
            ))}
          </div>

          {/* Messages Body */}
          <div className="chat-messages-body">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`chat-bubble-wrapper ${m.sender === 'user' ? 'user-msg' : 'ai-msg'}`}
              >
                {m.sender === 'ai' && (
                  <div className="chat-msg-avatar">
                    <Sparkles size={14} />
                  </div>
                )}
                <div className="chat-bubble">
                  <FormattedMarkdown text={m.text} />
                  <div className="chat-bubble-time">{m.time}</div>
                </div>
                {m.sender === 'user' && (
                  <div className="chat-msg-avatar user">
                    <User size={14} />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="chat-bubble-wrapper ai-msg">
                <div className="chat-msg-avatar">
                  <Sparkles size={14} />
                </div>
                <div className="chat-bubble typing-bubble">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            className="chat-input-area"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <input
              type="text"
              className="chat-input"
              placeholder="Ask about umbrella, biking, outfit, workout..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
            />
            <button
              type="submit"
              className="chat-send-btn"
              disabled={!input.trim() || isTyping}
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default WeatherChat;
