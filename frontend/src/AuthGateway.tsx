import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, LogIn, UserPlus, ShieldAlert, Check } from 'lucide-react';

interface GoogleAccount {
  name: string;
  email: string;
  avatar: string;
}

interface AuthGatewayProps {
  onLoginSuccess: (user: { name: string; email: string; avatarUrl?: string }) => void;
}

export const AuthGateway: React.FC<AuthGatewayProps> = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Google Sign-In simulation states
  const [googleAccounts, setGoogleAccounts] = useState<GoogleAccount[]>([]);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleStep, setGoogleStep] = useState<'picker' | 'email' | 'password' | 'consent'>('picker');
  const [googleEmail, setGoogleEmail] = useState('');
  const [googlePassword, setGooglePassword] = useState('');
  const [googleError, setGoogleError] = useState('');

  // Load cached google accounts on mount
  useEffect(() => {
    const cachedAccounts = localStorage.getItem('hearth_google_accounts');
    if (cachedAccounts) {
      try {
        setGoogleAccounts(JSON.parse(cachedAccounts));
      } catch (err) {
        console.error("Failed to parse cached Google accounts", err);
      }
    } else {
      // Default initial list containing the workspace owner/developer account
      const defaultAccounts = [
        { name: 'Developer', email: 'developer@hearth.space', avatar: 'D' }
      ];
      setGoogleAccounts(defaultAccounts);
      localStorage.setItem('hearth_google_accounts', JSON.stringify(defaultAccounts));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (activeTab === 'signup' && !name) {
      setError('Please provide your name.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({
        name: activeTab === 'signup' ? name : email.split('@')[0],
        email: email
      });
    }, 1200);
  };

  const handleGoogleLogin = () => {
    setGoogleEmail('');
    setGooglePassword('');
    setGoogleError('');
    setGoogleStep('picker');
    setShowGoogleModal(true);
  };

  const selectGoogleAccountDirectly = (account: GoogleAccount) => {
    setLoading(true);
    setShowGoogleModal(false);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({
        name: account.name,
        email: account.email
      });
    }, 1000);
  };

  const handleGoogleEmailNext = (e: React.FormEvent) => {
    e.preventDefault();
    setGoogleError('');
    if (!googleEmail) {
      setGoogleError('Enter an email or phone number');
      return;
    }
    if (!googleEmail.includes('@')) {
      setGoogleError('Enter a valid email address');
      return;
    }
    setGoogleStep('password');
  };

  const handleGooglePasswordNext = (e: React.FormEvent) => {
    e.preventDefault();
    setGoogleError('');
    if (!googlePassword) {
      setGoogleError('Enter your password');
      return;
    }
    if (googlePassword.length < 6) {
      setGoogleError('Wrong password. Try again.');
      return;
    }
    setGoogleStep('consent');
  };

  const handleGoogleConsentAllow = () => {
    setLoading(true);
    setShowGoogleModal(false);
    
    // Extract a nice name from email
    const prefix = googleEmail.split('@')[0];
    const formattedName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
    
    const newAccount: GoogleAccount = {
      name: formattedName,
      email: googleEmail,
      avatar: formattedName.charAt(0).toUpperCase()
    };
    
    // Update accounts list and cache it
    const updatedAccounts = [...googleAccounts.filter(acc => acc.email !== googleEmail), newAccount];
    setGoogleAccounts(updatedAccounts);
    localStorage.setItem('hearth_google_accounts', JSON.stringify(updatedAccounts));

    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({
        name: formattedName,
        email: googleEmail
      });
    }, 1200);
  };

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '80vh', 
      width: '100%',
      animation: 'fadeIn 0.6s ease-out'
    }}>
      <div className="glass-card auth-card" style={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
        {/* Header Logo */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 700, 
            background: 'linear-gradient(135deg, #a7f3d0 0%, #fcd34d 50%, #34d399 100%)',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            marginBottom: '0.25rem',
            filter: 'drop-shadow(0 2px 8px rgba(16, 185, 129, 0.2))'
          }}>
            Hearth
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Your Sanctuary for Mindful Emotional Reflection
          </p>
        </div>

        {/* Custom Tab Selector */}
        <div style={{ 
          display: 'flex', 
          backgroundColor: 'rgba(255, 255, 255, 0.02)', 
          border: '1px solid var(--border-color)', 
          padding: '0.3rem', 
          borderRadius: '10px' 
        }}>
          <button 
            type="button"
            onClick={() => { setActiveTab('login'); setError(''); }}
            style={{ 
              flex: 1, 
              padding: '0.6rem', 
              borderRadius: '8px', 
              border: 'none', 
              background: activeTab === 'login' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
              color: activeTab === 'login' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Log In
          </button>
          <button 
            type="button"
            onClick={() => { setActiveTab('signup'); setError(''); }}
            style={{ 
              flex: 1, 
              padding: '0.6rem', 
              borderRadius: '8px', 
              border: 'none', 
              background: activeTab === 'signup' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
              color: activeTab === 'signup' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div style={{ 
            padding: '0.75rem 1rem', 
            backgroundColor: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.3)', 
            borderRadius: '10px', 
            color: '#f87171', 
            fontSize: '0.85rem',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            {error}
          </div>
        )}

        {/* Main form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {activeTab === 'signup' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rakshith"
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem 1rem 0.75rem 2.5rem', 
                    borderRadius: '10px', 
                    border: '1px solid var(--border-color)', 
                    backgroundColor: 'rgba(255,255,255,0.01)', 
                    color: '#ffffff',
                    outline: 'none',
                    fontSize: '0.95rem'
                  }}
                />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                style={{ 
                  width: '100%', 
                  padding: '0.75rem 1rem 0.75rem 2.5rem', 
                  borderRadius: '10px', 
                  border: '1px solid var(--border-color)', 
                  backgroundColor: 'rgba(255,255,255,0.01)', 
                  color: '#ffffff',
                  outline: 'none',
                  fontSize: '0.95rem'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ 
                  width: '100%', 
                  padding: '0.75rem 1rem 0.75rem 2.5rem', 
                  borderRadius: '10px', 
                  border: '1px solid var(--border-color)', 
                  backgroundColor: 'rgba(255,255,255,0.01)', 
                  color: '#ffffff',
                  outline: 'none',
                  fontSize: '0.95rem'
                }}
              />
            </div>
          </div>

          {loading ? (
            <div className="bonfire-container" style={{ padding: '0.5rem 0' }}>
              <div className="bonfire" style={{ width: '40px', height: '40px' }}>
                <div className="log-wood" style={{ width: '28px', height: '5px', bottom: '2px' }}></div>
                <div className="log-wood" style={{ width: '28px', height: '5px', bottom: '2px' }}></div>
                <div className="flame flame-red" style={{ width: '24px', height: '24px', bottom: '4px' }}></div>
                <div className="flame flame-orange" style={{ width: '18px', height: '18px', bottom: '4px' }}></div>
                <div className="flame flame-yellow" style={{ width: '12px', height: '12px', bottom: '4px' }}></div>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Securing your sanctuary...</span>
            </div>
          ) : (
            <button type="submit" className="btn" style={{ width: '100%', marginTop: '0.5rem' }}>
              {activeTab === 'login' ? <><LogIn size={18} /> Log In</> : <><UserPlus size={18} /> Create Account</>}
            </button>
          )}
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0.2rem 0' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.06)' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>or</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.06)' }} />
        </div>

        {/* Auth Buttons Stack */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Google Sign-In Button */}
          <button 
            onClick={handleGoogleLogin}
            style={{
              width: '100%',
              padding: '0.8rem 1rem',
              borderRadius: '10px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              transition: 'all 0.25s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
              e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
              e.currentTarget.style.borderColor = 'var(--border-color)';
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Login as Guest Button */}
          <button 
            onClick={() => onLoginSuccess({ name: 'Hearth Guest', email: 'guest@hearth.space' })}
            style={{
              width: '100%',
              padding: '0.8rem 1rem',
              borderRadius: '10px',
              border: '1px solid rgba(251, 191, 36, 0.2)',
              backgroundColor: 'rgba(251, 191, 36, 0.02)',
              color: 'var(--accent-gold)',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.25s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(251, 191, 36, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(251, 191, 36, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(251, 191, 36, 0.02)';
              e.currentTarget.style.borderColor = 'rgba(251, 191, 36, 0.2)';
            }}
          >
            <User size={16} />
            Log In as Guest
          </button>
        </div>
      </div>

      {/* Google Login Simulation Modal (OAuth Emulation) */}
      {showGoogleModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-card" style={{ 
            maxWidth: '390px', 
            padding: '2.5rem', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1.25rem',
            textAlign: 'center',
            borderColor: 'rgba(255,255,255,0.08)'
          }}>
            {/* Google Logo */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
              <svg width="40" height="40" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </div>

            {googleStep === 'picker' && (
              <>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 500, color: '#ffffff', margin: 0 }}>Choose an account</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                  to continue to Hearth
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.75rem', maxHeight: '200px', overflowY: 'auto' }}>
                  {googleAccounts.map((account) => (
                    <div 
                      key={account.email}
                      onClick={() => selectGoogleAccountDirectly(account)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                        backgroundColor: 'rgba(255,255,255,0.02)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.08)'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'}
                    >
                      <div style={{ 
                        width: '36px', 
                        height: '36px', 
                        borderRadius: '50%', 
                        backgroundColor: account.avatar === 'R' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(251, 191, 36, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 600,
                        color: account.avatar === 'R' ? 'var(--primary)' : 'var(--accent-gold)',
                        fontSize: '1rem'
                      }}>
                        {account.avatar}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{account.name}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{account.email}</span>
                      </div>
                    </div>
                  ))}

                  {/* Use another account option */}
                  <div 
                    onClick={() => setGoogleStep('email')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      backgroundColor: 'rgba(255,255,255,0.01)',
                      border: '1px dashed var(--border-color)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      justifyContent: 'center',
                      color: 'var(--text-secondary)',
                      fontWeight: 600,
                      fontSize: '0.9rem'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                      e.currentTarget.style.color = '#ffffff';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.01)';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                  >
                    + Use another account
                  </div>
                </div>

                <button 
                  className="btn btn-secondary" 
                  onClick={() => setShowGoogleModal(false)}
                  style={{ width: '100%', marginTop: '0.5rem', borderRadius: '4px' }}
                >
                  Cancel
                </button>
              </>
            )}

            {googleStep === 'email' && (
              <>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 500, color: '#ffffff', margin: 0 }}>Sign in</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                  to continue to Hearth
                </p>

                {googleError && (
                  <div style={{ color: '#ef4444', fontSize: '0.8rem', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <ShieldAlert size={14} /> {googleError}
                  </div>
                )}

                <form onSubmit={handleGoogleEmailNext} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '0.5rem' }}>
                  <input 
                    type="email"
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    placeholder="Email or phone"
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      borderRadius: '4px',
                      border: '1px solid rgba(255,255,255,0.12)',
                      backgroundColor: 'transparent',
                      color: '#ffffff',
                      outline: 'none',
                      fontSize: '0.95rem'
                    }}
                  />
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                    <button 
                      type="button"
                      onClick={() => setGoogleStep('picker')}
                      style={{ background: 'none', border: 'none', color: '#60a5fa', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}
                    >
                      Back
                    </button>
                    <button type="submit" className="btn" style={{ padding: '0.6rem 1.5rem', borderRadius: '4px', fontSize: '0.9rem' }}>
                      Next
                    </button>
                  </div>
                </form>
              </>
            )}

            {googleStep === 'password' && (
              <>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 500, color: '#ffffff', margin: 0 }}>Welcome</h3>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.75rem',
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  width: 'fit-content',
                  margin: '0 auto'
                }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
                  {googleEmail}
                </div>

                {googleError && (
                  <div style={{ color: '#ef4444', fontSize: '0.8rem', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <ShieldAlert size={14} /> {googleError}
                  </div>
                )}

                <form onSubmit={handleGooglePasswordNext} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '0.5rem' }}>
                  <input 
                    type="password"
                    value={googlePassword}
                    onChange={(e) => setGooglePassword(e.target.value)}
                    placeholder="Enter your password"
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      borderRadius: '4px',
                      border: '1px solid rgba(255,255,255,0.12)',
                      backgroundColor: 'transparent',
                      color: '#ffffff',
                      outline: 'none',
                      fontSize: '0.95rem'
                    }}
                  />
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                    <button 
                      type="button"
                      onClick={() => setGoogleStep('email')}
                      style={{ background: 'none', border: 'none', color: '#60a5fa', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}
                    >
                      Back
                    </button>
                    <button type="submit" className="btn" style={{ padding: '0.6rem 1.5rem', borderRadius: '4px', fontSize: '0.9rem' }}>
                      Next
                    </button>
                  </div>
                </form>
              </>
            )}

            {googleStep === 'consent' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'fadeIn 0.3s ease-out' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ffffff', margin: 0, textAlign: 'left' }}>
                  Hearth wants to access your Google Account
                </h3>
                <div style={{ 
                  display: 'flex', 
                  gap: '0.5rem',
                  alignItems: 'center',
                  padding: '0.5rem 0.75rem',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  width: 'fit-content'
                }}>
                  {googleEmail}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left', margin: '0.5rem 0' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                    This will allow <strong>Hearth</strong> to:
                  </p>
                  
                  <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                    <Check size={16} style={{ color: 'var(--primary)', marginTop: '2px', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.85rem', color: '#e5e7eb' }}>
                      View and manage your Vertex AI Reasoning Engines (Agent Runtime) configurations
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                    <Check size={16} style={{ color: 'var(--primary)', marginTop: '2px', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.85rem', color: '#e5e7eb' }}>
                      Associate emotional logs with your email address for secure persistence
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
                  <button 
                    onClick={() => setShowGoogleModal(false)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: 'var(--text-secondary)', 
                      fontWeight: 600, 
                      fontSize: '0.9rem', 
                      cursor: 'pointer',
                      padding: '0.5rem 1rem' 
                    }}
                  >
                    Deny
                  </button>
                  <button 
                    onClick={handleGoogleConsentAllow} 
                    className="btn" 
                    style={{ padding: '0.5rem 1.5rem', borderRadius: '4px', fontSize: '0.9rem' }}
                  >
                    Allow
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
