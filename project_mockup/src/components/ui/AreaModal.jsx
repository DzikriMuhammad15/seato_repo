import React from 'react';

export default function AreaModal({ isOpen, onClose, onSelect, selectedArea }) {
  if (!isOpen) return null;

  const areas = [
    {
      id: 'Indoor',
      name: 'Indoor',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80',
      description: 'Area di dalam ruangan dengan AC dan suasana cozy.'
    },
    {
      id: 'Outdoor',
      name: 'Outdoor',
      image: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=400&q=80',
      description: 'Area luar ruangan yang sejuk dan asri.'
    },
    {
      id: 'Rooftop',
      name: 'Rooftop',
      image: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&w=400&q=80',
      description: 'Pemandangan kota yang indah dari atas gedung.'
    }
  ];

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 200 }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '24px', maxHeight: '80vh', overflowY: 'auto' }}>
        <h2 className="text-navy" style={{ marginBottom: '16px', textAlign: 'center' }}>Pilih Area Meja</h2>
        <div className="flex-col gap-4">
          {areas.map(area => (
            <div 
              key={area.id} 
              className={`card ${selectedArea === area.id ? 'active' : ''}`}
              onClick={() => {
                onSelect(area.id);
                onClose();
              }}
              style={{ 
                cursor: 'pointer', 
                padding: '0', 
                overflow: 'hidden',
                border: selectedArea === area.id ? '2px solid #1B3461' : '1px solid #E2E8F0'
              }}
            >
              <img src={area.image} alt={area.name} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
              <div style={{ padding: '12px' }}>
                <h3 className="text-navy" style={{ marginBottom: '4px' }}>{area.name}</h3>
                <p className="caption text-muted">{area.description}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="btn-outline-navy" style={{ width: '100%', marginTop: '20px' }} onClick={onClose}>
          Tutup
        </button>
      </div>
    </div>
  );
}
