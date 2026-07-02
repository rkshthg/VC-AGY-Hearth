import { useState, useEffect } from 'react';
import { EmotionWheel } from './EmotionWheel';
import { ChatInterface } from './ChatInterface';
import { CalendarTracker } from './CalendarTracker';
import { AuthGateway } from './AuthGateway';
import { Calendar, Home, PlusCircle, Clock, LogOut } from 'lucide-react';

interface JournalEntry {
  id: number;
  date: string;
  emotion_path: string;
  primaryEmotion: string;
  summary: string;
}

const colorMap: Record<string, string> = {
  Happy: "#fde047",
  Sad: "#60a5fa",
  Bad: "#4ade80",
  Angry: "#f87171",
  Disgusted: "#c084fc",
  Fearful: "#fb923c",
  Surprised: "#22d3ee",
  Unknown: "#9ca3af"
};

function App() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'home' | 'chat' | 'calendar'>('home');
  const [showWheelModal, setShowWheelModal] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<string[]>([]);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedPastEntry, setSelectedPastEntry] = useState<JournalEntry | null>(null);

  // Check login state on mount
  useEffect(() => {
    const cachedUser = localStorage.getItem('hearth_user');
    if (cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
      } catch (err) {
        console.error("Failed to parse cached user", err);
      }
    }
    setAuthLoading(false);
  }, []);

  const fetchEntries = () => {
    const userId = user ? user.email : 'guest';
    fetch(`/api/entries?user_id=${encodeURIComponent(userId)}`)
      .then(res => res.json())
      .then(data => {
        setEntries(data);
      })
      .catch(err => console.error("Failed to fetch entries", err));
  };

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [currentView, user]);

  const handleEmotionSelect = (path: string[]) => {
    setSelectedEmotion(path);
    setShowWheelModal(false);
    setCurrentView('chat');
  };

  const handleWrapUp = (summary: string) => {
    console.log("Session wrapped up with summary:", summary);
    fetchEntries();
    setCurrentView('calendar');
  };

  const handleLoginSuccess = (profile: { name: string; email: string }) => {
    localStorage.setItem('hearth_user', JSON.stringify(profile));
    setUser(profile);
  };

  const handleLogout = () => {
    localStorage.removeItem('hearth_user');
    setUser(null);
    setCurrentView('home');
  };

  // Last 7 days scrollable list
  const today = new Date('2026-07-01');
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  if (authLoading) {
    return (
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div className="bonfire-container">
          <div className="bonfire">
            <div className="log-wood"></div>
            <div className="log-wood"></div>
            <div className="flame flame-red"></div>
            <div className="flame flame-orange"></div>
            <div className="flame flame-yellow"></div>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>Preparing your Hearth...</p>
        </div>
      </div>
    );
  }

  // Render Login/Signup Gate if unauthenticated
  if (!user) {
    return (
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <AuthGateway onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Premium Header */}
      <header className="header-container">
        <div className="header-title-section">
          <h1 style={{ cursor: 'pointer' }} onClick={() => setCurrentView('home')}>Hearth</h1>
          <p style={{ margin: 0 }}>Your AI Journal & Emotion Tracker</p>
        </div>
        <nav className="header-nav">
          <button className="btn btn-secondary" onClick={() => setCurrentView('home')} style={{ borderRadius: '12px' }}>
            <Home size={18} /> Home
          </button>
          <button className="btn btn-secondary" onClick={() => setCurrentView('calendar')} style={{ borderRadius: '12px' }}>
            <Calendar size={18} /> Journey Calendar
          </button>
          <button className="btn btn-secondary btn-danger" onClick={handleLogout} style={{ borderRadius: '12px', gap: '0.4rem', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
            <LogOut size={16} /> Log Out
          </button>
        </nav>
      </header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        
        {/* HOME VIEW */}
        {currentView === 'home' && (
          <div className="home-dashboard-layout">
            
            {/* Greeting & Log Session Button */}
            <div className="glass-card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 600 }}>Hello, {user.name}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '500px' }}>
                How is your day unfolding? Let's take a moment to explore, track, and reflect on your emotional well-being.
              </p>
              <button className="btn" onClick={() => setShowWheelModal(true)} style={{ marginTop: '0.5rem', padding: '0.9rem 2.25rem' }}>
                <PlusCircle size={20} /> Log New Session
              </button>
            </div>

            {/* Scrollable 7 Days Calendar */}
            <div className="glass-card">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1.25rem', color: 'var(--text-secondary)' }}>
                Recent Check-Ins (Last 7 Days)
              </h3>
              
              <div className="recent-checkins-wrapper">
                <div className="recent-checkins-list">
                  {last7Days.map(dayStr => {
                    const entry = entries.find(e => e.date === dayStr);
                    const color = entry ? colorMap[entry.primaryEmotion] || colorMap.Unknown : 'transparent';
                    const dateObj = new Date(dayStr);
                    const dayNum = dateObj.getDate();
                    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                    
                    return (
                      <div 
                        key={dayStr}
                        onClick={() => entry && setSelectedPastEntry(entry)}
                        style={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center',
                          flex: 1,
                          minWidth: '0',
                          padding: '1rem 0.25rem',
                          backgroundColor: entry ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.01)',
                          border: selectedPastEntry?.date === dayStr ? `2px solid ${color || 'var(--primary)'}` : '1px solid var(--border-color)',
                          borderRadius: '16px',
                          cursor: entry ? 'pointer' : 'default',
                          opacity: entry ? 1 : 0.4,
                          transition: 'all 0.2s ease',
                        }}
                        onMouseOver={(e) => { if (entry) e.currentTarget.style.transform = 'translateY(-2px)'; }}
                        onMouseOut={(e) => { if (entry) e.currentTarget.style.transform = 'translateY(0px)'; }}
                      >
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{dayName}</span>
                        <div style={{ 
                          width: '36px', 
                          height: '36px', 
                          borderRadius: '50%', 
                          backgroundColor: entry ? `${color}15` : 'transparent',
                          border: entry ? `2px solid ${color}` : '1px dashed rgba(255,255,255,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          color: entry ? color : 'var(--text-secondary)'
                        }}>
                          {dayNum}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Day Details Card on Home view */}
              {selectedPastEntry && (
                <div style={{ 
                  marginTop: '1.5rem', 
                  padding: '1.25rem', 
                  backgroundColor: 'rgba(255,255,255,0.01)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '12px',
                  animation: 'fadeIn 0.3s ease-out',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Clock size={14} /> {selectedPastEntry.date}
                    </span>
                    <span style={{ 
                      backgroundColor: `${colorMap[selectedPastEntry.primaryEmotion] || colorMap.Unknown}15`, 
                      color: colorMap[selectedPastEntry.primaryEmotion] || colorMap.Unknown,
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      border: `1px solid ${colorMap[selectedPastEntry.primaryEmotion] || colorMap.Unknown}30`
                    }}>
                      {selectedPastEntry.primaryEmotion}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.9rem', fontWeight: 500, color: '#f3f4f6' }}>Path: {selectedPastEntry.emotion_path}</p>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.5', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}>
                    {selectedPastEntry.summary}
                  </p>
                </div>
              )}

            </div>

          </div>
        )}

        {/* CHAT VIEW */}
        {currentView === 'chat' && (
          <ChatInterface 
            initialEmotion={selectedEmotion.length > 0 ? selectedEmotion : ["General"]} 
            onWrapUp={handleWrapUp}
            onBackHome={() => setCurrentView('home')}
          />
        )}

        {/* JOURNEY CALENDAR VIEW */}
        {currentView === 'calendar' && (
          <CalendarTracker />
        )}

      </main>

      {/* Interactive 3-Tier Emotion Wheel Modal */}
      {showWheelModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-card" style={{ position: 'relative', width: '100%', maxWidth: '580px', padding: '2rem' }}>
            <button 
              className="btn btn-secondary" 
              onClick={() => setShowWheelModal(false)}
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.85rem' }}
            >
              Close
            </button>
            <EmotionWheel onEmotionSelect={handleEmotionSelect} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
