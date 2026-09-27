"use client";
import React, { useState } from 'react';
import { IconMail, IconLock, IconLogin } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('partnerRestoId', data.restaurantId);
        router.push('/admin');
      } else {
        setErrorMsg(data.error || 'Login failed');
      }
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
      background: 'white',
      padding: '32px 24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative header */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '220px', background: 'linear-gradient(135deg, #1B3461 0%, #0EA5A0 100%)', borderBottomLeftRadius: '32px', borderBottomRightRadius: '32px' }} />

      <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ textAlign: 'center', marginTop: '60px', marginBottom: '48px', color: 'white' }}>
          <div style={{ 
            width: '70px', height: '70px', background: 'white', 
            borderRadius: '20px', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', margin: '0 auto 16px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            color: '#0EA5A0'
          }}>
            <span style={{ fontSize: '28px', fontWeight: 800 }}>A</span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Partner Portal</h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>Manage your restaurant on SEATO.</p>
        </div>

        <div style={{ background: 'white', borderRadius: '24px', padding: '32px 24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', flex: 1 }}>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: '#94A3B8' }}>
                <IconMail size={20} />
              </div>
              <input 
                type="email" 
                placeholder="Partner Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  background: '#F1F5F9',
                  border: '1px solid #E2E8F0',
                  padding: '16px 16px 16px 48px',
                  borderRadius: '16px',
                  color: '#0F172A',
                  fontSize: '15px',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: '#94A3B8' }}>
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
                  background: '#F1F5F9',
                  border: '1px solid #E2E8F0',
                  padding: '16px 16px 16px 48px',
                  borderRadius: '16px',
                  color: '#0F172A',
                  fontSize: '15px',
                  outline: 'none',
                }}
              />
            </div>

            {errorMsg && (
              <div style={{ color: '#EF4444', fontSize: '14px', textAlign: 'center', marginTop: '8px' }}>
                {errorMsg}
              </div>
            )}

            <button type="submit" disabled={isLoading} style={{
              background: isLoading ? '#94A3B8' : '#0EA5A0',
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
              boxShadow: isLoading ? 'none' : '0 8px 20px rgba(14, 165, 160, 0.3)',
              marginTop: '16px'
            }}>
              <IconLogin size={20} /> {isLoading ? 'Logging in...' : 'Login as Partner'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
