import React, { useState } from 'react';

export default function ReviewModal({ reservation, onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setIsSubmitting(true);
    await onSubmit({ rating, comment });
    setIsSubmitting(false);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', padding: '24px', borderRadius: '24px', width: '90%', maxWidth: '360px', animation: 'slideUp 0.3s ease-out' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '8px', color: '#1B3461', textAlign: 'center' }}>Beri Ulasan</h2>
        <p style={{ fontSize: '13px', color: '#64748B', textAlign: 'center', marginBottom: '24px' }}>
          Gimana pengalaman kamu makan di <strong>{reservation?.restaurantName}</strong>?
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <div 
              key={star} 
              onClick={() => setRating(star)}
              style={{ cursor: 'pointer', color: rating >= star ? '#F59E0B' : '#E2E8F0' }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill={rating >= star ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '24px' }}>
          <textarea
            placeholder="Ada komentar tambahan? (Opsional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{ width: '100%', height: '100px', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', resize: 'none', fontSize: '14px', fontFamily: 'inherit' }}
          ></textarea>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '12px', background: '#F1F5F9', color: '#64748B', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>
            Batal
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={rating === 0 || isSubmitting}
            style={{ flex: 1, padding: '12px', background: rating === 0 ? '#CBD5E1' : '#1B3461', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: rating === 0 ? 'not-allowed' : 'pointer' }}>
            {isSubmitting ? 'Mengirim...' : 'Kirim'}
          </button>
        </div>
      </div>
    </div>
  );
}
