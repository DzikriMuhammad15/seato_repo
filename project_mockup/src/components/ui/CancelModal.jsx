import React, { useState } from 'react';

export default function CancelModal({ onClose, onConfirm, cancelCount = 0 }) {
  const [reason, setReason] = useState('Berubah Pikiran');
  const remaining = 5 - cancelCount;

  const reasons = [
    'Berubah Pikiran',
    'Sakit / Urusan Mendadak',
    'Pesan di Tempat Lain',
    'Kendala Transportasi',
    'Lainnya'
  ];

  return (
    <div className="bottom-sheet-overlay" onClick={onClose} style={{ zIndex: 100 }}>
      <div className="bottom-sheet" onClick={e => e.stopPropagation()} style={{ padding: '24px 20px', transform: 'translateY(0)', transition: 'transform 0.3s' }}>
        <div className="flex-row justify-between" style={{ marginBottom: '24px' }}>
          <h1 className="text-navy" style={{ fontSize: '20px' }}>Batalkan Reservasi</h1>
          <i className="ti ti-x" style={{ fontSize: '24px', cursor: 'pointer', color: '#64748B' }} onClick={onClose}></i>
        </div>
        
        <p className="text-muted" style={{ marginBottom: '20px' }}>
          Apakah Anda yakin ingin membatalkan reservasi ini? Mohon beritahu kami alasannya:
        </p>

        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '12px', marginBottom: '20px' }}>
          <p style={{ fontSize: '12px', color: '#B91C1C', margin: 0, fontWeight: 600 }}>
            <i className="ti ti-alert-triangle" style={{ marginRight: '6px' }}></i>
            Perhatian: Anda memiliki sisa {remaining}x kuota pembatalan. Jika mencapai batas (5x), akun Anda akan terkena soft ban dan tidak dapat membuat reservasi baru.
          </p>
        </div>

        <div className="flex-col gap-3" style={{ marginBottom: '32px' }}>
          {reasons.map(r => (
            <label key={r} className="flex-row gap-3" style={{ alignItems: 'center', cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="cancelReason" 
                value={r} 
                checked={reason === r}
                onChange={(e) => setReason(e.target.value)}
                style={{ width: '20px', height: '20px', accentColor: '#E11D48' }}
              />
              <span className="text-navy">{r}</span>
            </label>
          ))}
        </div>

        <div className="flex-col gap-3">
          <button className="btn-cta" style={{ background: '#E11D48' }} onClick={() => onConfirm(reason)}>
            Ya, Batalkan Reservasi
          </button>
          <button className="btn-outline-navy" onClick={onClose}>
            Tidak, Kembali
          </button>
        </div>
      </div>
    </div>
  );
}
