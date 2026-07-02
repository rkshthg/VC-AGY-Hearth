import React, { useState, useEffect, useRef } from 'react';
import { Send, CheckCircle, ArrowLeft, Heart, User, Check, Edit3 } from 'lucide-react';

interface Message {
  role: 'user' | 'agent';
  content: string;
}

interface ChatInterfaceProps {
  initialEmotion: string[];
  onWrapUp: (summary: string) => void;
  onBackHome: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ initialEmotion, onWrapUp, onBackHome }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [session_id, setSessionId] = useState<string | null>(null);
  const [turnCount, setTurnCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summaryText, setSummaryText] = useState('');
  const [submittingSummary, setSubmittingSummary] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const maxTurns = 10;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize session on mount
  useEffect(() => {
    const initSession = async () => {
      setLoading(true);
      try {
        const cachedUser = localStorage.getItem('hearth_user');
        let userId = 'guest';
        if (cachedUser) {
          try {
            const u = JSON.parse(cachedUser);
            if (u && u.email) userId = u.email;
          } catch (e) {
            console.error(e);
          }
        }
        const emotionMsg = initialEmotion.join(' -> ');
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: emotionMsg, user_id: userId })
        });
        const data = await res.json();
        
        if (data.session_id) {
          setSessionId(data.session_id);
          setMessages([{ role: 'agent', content: data.response }]);
          setTurnCount(data.turn_count);
        }
      } catch (err) {
        console.error("Failed to initialize session", err);
      } finally {
        setLoading(false);
      }
    };
    initSession();
  }, [initialEmotion]);

  const handleSend = async (customMessage?: string) => {
    const textToSend = customMessage !== undefined ? customMessage : inputValue.trim();
    if (!textToSend || loading) return;

    if (customMessage === undefined) {
      setMessages(prev => [...prev, { role: 'user', content: textToSend }]);
      setInputValue('');
    }
    
    setLoading(true);

    try {
      const cachedUser = localStorage.getItem('hearth_user');
      let userId = 'guest';
      if (cachedUser) {
        try {
          const u = JSON.parse(cachedUser);
          if (u && u.email) userId = u.email;
        } catch (e) {
          console.error(e);
        }
      }
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: textToSend,
          session_id: session_id,
          user_id: userId
        })
      });
      const data = await res.json();
      
      setMessages(prev => [...prev, { role: 'agent', content: data.response }]);
      setTurnCount(data.turn_count);

      // Handle automatic wrap up or scribe summary trigger
      if (data.summary) {
        setSummaryText(data.summary);
        setShowSummaryModal(true);
      } else if (data.pending_approval) {
        setSummaryText(data.response);
        setShowSummaryModal(true);
      }
    } catch (err) {
      console.error("Error sending message", err);
    } finally {
      setLoading(false);
    }
  };

  const triggerWrapUp = () => {
    handleSend("wrap up");
  };

  const handleApproveSummary = async () => {
    setSubmittingSummary(true);
    try {
      const cachedUser = localStorage.getItem('hearth_user');
      let userId = 'guest';
      if (cachedUser) {
        try {
          const u = JSON.parse(cachedUser);
          if (u && u.email) userId = u.email;
        } catch (e) {
          console.error(e);
        }
      }
      // Save directly to the database via API
      const res = await fetch('/api/save_entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summary: summaryText,
          emotion_path: initialEmotion.join(' -> '),
          user_id: userId
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setShowSummaryModal(false);
        onWrapUp(summaryText);
      }
    } catch (err) {
      console.error("Failed to save entry", err);
    } finally {
      setSubmittingSummary(false);
    }
  };

  return (
    <div className="glass-card chat-layout-container">
      
      {/* Header */}
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.01)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={onBackHome} style={{ padding: '0.5rem', borderRadius: '10px' }}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>Exploring: {initialEmotion[initialEmotion.length - 1]}</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Session Turn {turnCount} / {maxTurns}
            </p>
          </div>
        </div>
        <button 
          className="btn btn-secondary" 
          onClick={triggerWrapUp}
          disabled={loading || messages.length <= 1}
          style={{ padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.9rem', borderColor: 'rgba(99,102,241,0.3)', color: 'rgba(165,180,252,0.9)' }}
        >
          <CheckCircle size={16} /> Wrap Up
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <div key={idx} style={{ 
              display: 'flex',
              justifyContent: isUser ? 'flex-end' : 'flex-start',
              gap: '0.75rem',
              animation: 'fadeIn 0.3s ease-out'
            }}>
              {!isUser && (
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyItems: 'center', border: '1px solid rgba(99,102,241,0.2)', paddingLeft: '7px', paddingTop: '3px' }}>
                  <Heart size={16} style={{ color: 'var(--primary)' }} />
                </div>
              )}
              <div style={{ 
                maxWidth: '75%',
                backgroundColor: isUser ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.03)',
                border: isUser ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid var(--border-color)',
                padding: '0.9rem 1.25rem',
                borderRadius: '16px',
                borderTopRightRadius: isUser ? '2px' : '16px',
                borderTopLeftRadius: !isUser ? '2px' : '16px',
                fontSize: '1rem',
                lineHeight: '1.5',
                color: isUser ? '#f3f4f6' : '#e5e7eb',
                boxShadow: isUser ? '0 4px 12px rgba(99, 102, 241, 0.05)' : 'none'
              }}>
                {msg.content}
              </div>
              {isUser && (
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyItems: 'center', border: '1px solid var(--border-color)', paddingLeft: '7px', paddingTop: '3px' }}>
                  <User size={16} style={{ color: 'var(--text-secondary)' }} />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading / Bonfire Loader */}
        {loading && (
          <div style={{ display: 'flex', gap: '0.75rem', animation: 'fadeIn 0.3s ease-out' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyItems: 'center', border: '1px solid rgba(99,102,241,0.2)', paddingLeft: '7px', paddingTop: '3px' }}>
              <Heart size={16} style={{ color: 'var(--primary)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
              <div className="bonfire" style={{ width: '40px', height: '40px' }}>
                <div className="log-wood" style={{ width: '28px', height: '5px', bottom: '2px' }}></div>
                <div className="log-wood" style={{ width: '28px', height: '5px', bottom: '2px' }}></div>
                <div className="flame flame-red" style={{ width: '25px', height: '25px', bottom: '6px' }}></div>
                <div className="flame flame-orange" style={{ width: '18px', height: '18px', bottom: '6px' }}></div>
                <div className="flame flame-yellow" style={{ width: '12px', height: '12px', bottom: '6px' }}></div>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Gathering thoughts...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.75rem', backgroundColor: 'rgba(255,255,255,0.01)' }}>
        <textarea 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Reflect on your day..."
          disabled={loading || turnCount >= maxTurns}
          rows={1}
          style={{ 
            flex: 1, 
            padding: '0.85rem 1.25rem', 
            borderRadius: '12px', 
            border: '1px solid var(--border-color)',
            backgroundColor: 'rgba(255,255,255,0.02)',
            color: 'var(--text-color)',
            outline: 'none',
            fontSize: '1rem',
            resize: 'none',
            fontFamily: 'inherit',
            transition: 'border-color 0.2s ease',
            maxHeight: '80px'
          }}
        />
        <button 
          className="btn" 
          onClick={() => handleSend()} 
          disabled={loading || !inputValue.trim() || turnCount >= maxTurns}
          style={{ borderRadius: '12px', width: '48px', height: '48px', padding: 0 }}
        >
          <Send size={18} />
        </button>
      </div>

      {/* Pop-out Summary Modal */}
      {showSummaryModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Edit3 size={24} style={{ color: 'var(--primary)' }} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Final Journal Summary</h3>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              The Scribe Agent has synthesized your session. Please review and edit the entry as you like before saving.
            </p>

            <textarea
              value={summaryText}
              onChange={(e) => setSummaryText(e.target.value)}
              rows={8}
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'rgba(255,255,255,0.02)',
                color: 'var(--text-color)',
                outline: 'none',
                fontFamily: 'inherit',
                fontSize: '1.05rem',
                lineHeight: '1.5',
                resize: 'vertical'
              }}
            />

            {submittingSummary ? (
              <div className="bonfire-container">
                <div className="bonfire">
                  <div className="log-wood"></div>
                  <div className="log-wood"></div>
                  <div className="flame flame-red"></div>
                  <div className="flame flame-orange"></div>
                  <div className="flame flame-yellow"></div>
                </div>
                <p style={{ color: 'var(--text-secondary)' }}>Saving entry to database...</p>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button className="btn btn-secondary" onClick={() => setShowSummaryModal(false)}>
                  Cancel
                </button>
                <button className="btn" onClick={handleApproveSummary}>
                  <Check size={18} /> Approve & Save
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
