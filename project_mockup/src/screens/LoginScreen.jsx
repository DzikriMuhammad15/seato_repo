import React, { useState } from 'react';
import { IconMail, IconLock, IconLogin } from '@tabler/icons-react';

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Login failed');
        return;
      }

      if (onLogin) onLogin(data.user);
    } catch (err) {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(180deg, #1B3461 0%, #0F172A 100%)',
      color: 'white',
      padding: '32px 24px',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Circles */}
      <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(14, 165, 160, 0.2)', filter: 'blur(40px)' }} />
      <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(27, 52, 97, 0.8)', filter: 'blur(50px)' }} />

      <div style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ 
            width: '80px', height: '80px', background: '#0EA5A0', 
            borderRadius: '24px', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', margin: '0 auto 24px',
            boxShadow: '0 10px 25px rgba(14, 165, 160, 0.4)'
          }}>
            <span style={{ fontSize: '32px', fontWeight: 800 }}>S</span>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>SEATO</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px' }}>Find and book the best tables in town.</p>
        </div>

        {errorMsg && (
          <div style={{ background: 'rgba(255,0,0,0.1)', color: '#ff6b6b', padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', fontSize: '14px' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.5)' }}>
              <IconMail size={20} />
            </div>
            <input 
              type="email" 
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '16px 16px 16px 48px',
                borderRadius: '16px',
                color: 'white',
                fontSize: '15px',
                outline: 'none',
                transition: 'all 0.3s'
              }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.5)' }}>
              <IconLock size={20} />
            </div>
            <input 
              type="password" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '16px 16px 16px 48px',
                borderRadius: '16px',
                color: 'white',
                fontSize: '15px',
                outline: 'none',
                transition: 'all 0.3s'
              }}
            />
          </div>

          <div style={{ textAlign: 'right', marginTop: '-8px' }}>
            <a href="#" style={{ color: '#0EA5A0', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>Forgot Password?</a>
          </div>

          <button type="submit" disabled={isLoading} style={{
            background: '#0EA5A0',
            color: 'white',
            border: 'none',
            padding: '16px',
            borderRadius: '16px',
            fontSize: '16px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            boxShadow: '0 8px 20px rgba(14, 165, 160, 0.3)',
            marginTop: '16px',
            opacity: isLoading ? 0.7 : 1
          }}>
            <IconLogin size={20} /> {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
            Don't have an account? <a href="#" style={{ color: '#0EA5A0', fontWeight: 600, textDecoration: 'none' }}>Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}
