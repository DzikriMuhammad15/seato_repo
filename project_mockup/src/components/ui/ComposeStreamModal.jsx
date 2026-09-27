import React, { useState, useEffect } from 'react';

export default function ComposeStreamModal({ onClose, onSubmit, replyTo }) {
  const [content, setContent] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/restaurants')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setRestaurants(data);
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setIsSubmitting(true);
    await onSubmit({ content, restaurantId: selectedRestaurantId || null, parentId: replyTo?.id || null });
    setIsSubmitting(false);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', padding: '24px', borderRadius: '24px', width: '90%', maxWidth: '400px', animation: 'slideUp 0.3s ease-out' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '4px', color: '#1B3461', textAlign: 'center' }}>
          {replyTo ? 'Balas Postingan' : 'Buat Postingan'}
        </h2>
        {replyTo && (
          <p style={{ fontSize: '12px', color: '#64748B', textAlign: 'center', marginBottom: '16px' }}>
            Membalas <strong>@{replyTo.authorName}</strong>
          </p>
        )}
        {!replyTo && <div style={{ marginBottom: '16px' }}></div>}
        
        <div style={{ marginBottom: '16px' }}>
          <textarea
            placeholder={replyTo ? 'Tulis balasanmu di sini...' : 'Ada cerita apa hari ini? (Review, rekomendasi, dll)'}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ width: '100%', height: '120px', padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0', outline: 'none', resize: 'none', fontSize: '15px', fontFamily: 'inherit', background: '#F8FAFC' }}
          ></textarea>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '13px', color: '#64748B', marginBottom: '8px', fontWeight: 600 }}>Tag Restoran (Opsional)</label>
          <div style={{ position: 'relative' }}>
            <select 
              value={selectedRestaurantId} 
              onChange={(e) => setSelectedRestaurantId(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', appearance: 'none', fontSize: '14px', background: 'white', color: '#0F172A' }}
            >
              <option value="">-- Pilih Restoran untuk di-tag --</option>
              {restaurants.map(r => (
                <option key={r.id} value={r.id}>{r.name} - {r.city}</option>
              ))}
            </select>
            <i className="ti ti-chevron-down" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', pointerEvents: 'none' }}></i>
          </div>
          <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '6px' }}>
            <i className="ti ti-info-circle"></i> Menandai restoran akan membantunya masuk ke daftar Trending!
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '14px', background: '#F1F5F9', color: '#64748B', border: 'none', borderRadius: '14px', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}>
            Batal
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={!content.trim() || isSubmitting}
            style={{ flex: 1, padding: '14px', background: !content.trim() ? '#CBD5E1' : '#1B3461', color: 'white', border: 'none', borderRadius: '14px', fontWeight: 700, cursor: !content.trim() ? 'not-allowed' : 'pointer', fontSize: '14px' }}>
            {isSubmitting ? 'Mengirim...' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
}
