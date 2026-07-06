import React, { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, BookOpen, Clock, Heart, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

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

export const CalendarTracker: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-07-01');
  const [viewDate, setViewDate] = useState<Date>(new Date('2026-07-01'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetch(`/api/entries?user_id=${encodeURIComponent(userId)}`)
      .then(res => res.json())
      .then(data => {
        setEntries(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch entries", err);
        setLoading(false);
      });
  }, []);

  // Navigation handlers
  const prevMonth = () => {
    setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const prevYear = () => {
    setViewDate(prev => new Date(prev.getFullYear() - 1, prev.getMonth(), 1));
  };

  const nextYear = () => {
    setViewDate(prev => new Date(prev.getFullYear() + 1, prev.getMonth(), 1));
  };

  // Calendar calculations
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  
  // First day of the month
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  // Number of days in the month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Create grid cells
  const blanks = Array.from({ length: firstDayOfMonth }, () => null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const gridCells = [...blanks, ...days];

  const monthName = viewDate.toLocaleDateString('en-US', { month: 'long' });

  // Get logs on the selected date
  const selectedLogs = entries.filter(e => e.date === selectedDateStr);

  if (loading) {
    return (
      <div className="bonfire-container">
        <div className="bonfire">
          <div className="log-wood"></div>
          <div className="log-wood"></div>
          <div className="flame flame-red"></div>
          <div className="flame flame-orange"></div>
          <div className="flame flame-yellow"></div>
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>Gathering your journal history...</p>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ width: '100%', maxWidth: '960px', margin: '0 auto' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <CalendarIcon size={28} style={{ color: 'var(--primary)' }} />
        <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>Journey Calendar</h2>
      </div>

      {/* Main Grid: Left Calendar, Right Day Details */}
      <div className="calendar-layout-grid">
        
        {/* Left Column: Monthly Calendar View */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Calendar Header Navigation */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            backgroundColor: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border-color)',
            padding: '0.75rem 1.25rem',
            borderRadius: '14px'
          }}>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button onClick={prevYear} className="btn btn-secondary" style={{ padding: '0.45rem', borderRadius: '8px' }} title="Previous Year">
                <ChevronsLeft size={16} />
              </button>
              <button onClick={prevMonth} className="btn btn-secondary" style={{ padding: '0.45rem', borderRadius: '8px' }} title="Previous Month">
                <ChevronLeft size={16} />
              </button>
            </div>
            
            <span style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--accent-gold)' }}>
              {monthName} {year}
            </span>

            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button onClick={nextMonth} className="btn btn-secondary" style={{ padding: '0.45rem', borderRadius: '8px' }} title="Next Month">
                <ChevronRight size={16} />
              </button>
              <button onClick={nextYear} className="btn btn-secondary" style={{ padding: '0.45rem', borderRadius: '8px' }} title="Next Year">
                <ChevronsRight size={16} />
              </button>
            </div>
          </div>

          {/* Calendar Weekdays */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', textAlign: 'center', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Calendar Days Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
            {gridCells.map((dayNum, cellIdx) => {
              if (dayNum === null) {
                return <div key={`empty-${cellIdx}`} style={{ aspectRatio: '1' }} />;
              }

              // Format cell date string: YYYY-MM-DD
              const mm = String(month + 1).padStart(2, '0');
              const dd = String(dayNum).padStart(2, '0');
              const cellDateStr = `${year}-${mm}-${dd}`;
              
              // Find entries for this date
              const dayLogs = entries.filter(e => e.date === cellDateStr);
              const hasLogs = dayLogs.length > 0;
              const isSelected = selectedDateStr === cellDateStr;
              
              const highlightColor = hasLogs ? (colorMap[dayLogs[0].primaryEmotion] || colorMap.Unknown) : 'transparent';
              
              // Check if it is today (for styling today's cell)
              const today = new Date();
              const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
              const isToday = cellDateStr === todayStr;

              return (
                <div 
                  key={`day-${dayNum}`}
                  onClick={() => setSelectedDateStr(cellDateStr)}
                  style={{
                    aspectRatio: '1',
                    borderRadius: '12px',
                    backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255,255,255,0.01)',
                    border: isSelected 
                      ? '2.5px solid var(--primary)' 
                      : isToday 
                        ? '1.5px solid var(--accent-gold)' 
                        : '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 0 15px rgba(16,185,129,0.2)' : 'none'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = isSelected ? 'rgba(16, 185, 129, 0.18)' : 'rgba(255,255,255,0.03)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = isSelected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255,255,255,0.01)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <span style={{ 
                    fontWeight: 600, 
                    fontSize: '1rem',
                    color: isSelected ? '#ffffff' : hasLogs ? highlightColor : 'var(--text-color)'
                  }}>
                    {dayNum}
                  </span>
                  
                  {/* Dot/Indicator for logs */}
                  {hasLogs && (
                    <div style={{
                      position: 'absolute',
                      bottom: '6px',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: highlightColor,
                      boxShadow: `0 0 6px ${highlightColor}`
                    }} />
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Column: Day Logs Detail */}
        <div style={{ 
          backgroundColor: 'rgba(255,255,255,0.02)', 
          border: '1px solid var(--border-color)', 
          borderRadius: '16px', 
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          maxHeight: '440px',
          overflowY: 'auto'
        }}>
          
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>Logs on {selectedDateStr}</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              {selectedLogs.length} {selectedLogs.length === 1 ? 'entry' : 'entries'} found
            </p>
          </div>

          {selectedLogs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
              <BookOpen size={36} style={{ opacity: 0.4 }} />
              <p style={{ fontSize: '0.95rem' }}>No emotional logs checked in on this day.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {selectedLogs.map((log, idx) => {
                const color = colorMap[log.primaryEmotion] || colorMap.Unknown;
                return (
                  <div 
                    key={log.id} 
                    style={{ 
                      padding: '1.25rem', 
                      backgroundColor: 'rgba(255,255,255,0.01)',
                      borderLeft: `4px solid ${color}`,
                      borderRadius: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                      animation: 'fadeIn 0.3s ease-out'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={12} /> Log #{selectedLogs.length - idx}
                      </span>
                      <span style={{ 
                        backgroundColor: `${color}15`, 
                        color: color,
                        padding: '0.25rem 0.65rem',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        border: `1px solid ${color}30`
                      }}>
                        {log.primaryEmotion}
                      </span>
                    </div>

                    <div>
                      <h5 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                        Emotion Path
                      </h5>
                      <p style={{ fontWeight: 600, color: '#f3f4f6', fontSize: '0.9rem' }}>{log.emotion_path}</p>
                    </div>

                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}>
                      <h5 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Heart size={12} /> Journal Summary
                      </h5>
                      <p style={{ 
                        lineHeight: '1.5', 
                        color: '#e5e7eb', 
                        fontSize: '0.95rem',
                        whiteSpace: 'pre-line' 
                      }}>
                        {log.summary}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
