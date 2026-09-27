import React, { useState, useEffect } from 'react';
import RestaurantCard from '../components/ui/RestaurantCard';

export default function CategoryDetailScreen({ category, onBack, onSelectRestaurant }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/restaurants')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const filtered = data.filter(r => {
            if (category === 'Semua') return true;
            if (category === 'Trending') return r.isTrending;
            return r.tags.includes(category) || r.type.includes(category);
          });
          setRestaurants(filtered);
        }
        setLoading(false);
      });
  }, [category]);

  return (
    <div className="screen-content bg-gray-50" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 100, overflowY: 'auto' }}>
      <div className="flex-row justify-between items-center" style={{ padding: '16px 16px 12px', position: 'sticky', top: 0, background: 'rgba(248, 250, 252, 0.85)', backdropFilter: 'blur(12px)', zIndex: 20 }}>
        <div className="icon-btn-modern" onClick={onBack} style={{ background: '#FFFFFF', color: '#1B3461', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', width: '36px', height: '36px' }}>
          <i className="ti ti-arrow-left" style={{ fontSize: '18px' }}></i>
        </div>
        <h2 className="text-navy font-bold m-0" style={{ fontSize: '16px', letterSpacing: '-0.1px' }}>{category}</h2>
        <div style={{ width: '36px' }}></div> {/* Spacer to center title */}
      </div>

      <div style={{ padding: '12px 16px' }}>
        {category === 'Trending' || category === 'Top Chart' ? (
<div style={{
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 'calc(100vh - 120px)', // 120px = estimasi tinggi header + navbar
  textAlign: 'center',
  padding: '0 20px',
}}>            <div style={{ width: '80px', height: '80px', borderRadius: '40px', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <i className={category === 'Trending' ? "ti ti-flame text-primary" : "ti ti-chart-bar text-primary"} style={{ fontSize: '40px', color: '#E11D48' }}></i>
            </div>
            <h2 className="text-navy" style={{ fontSize: '20px', marginBottom: '8px' }}>Segera Hadir!</h2>
            <p className="text-muted" style={{ lineHeight: '1.5' }}>Fitur kategori <b>{category}</b> sedang dalam tahap pengembangan. Pantau terus ya!</p>
            <button onClick={onBack} className="btn-cta" style={{ marginTop: '32px', width: 'auto', padding: '0 32px' }}>Kembali</button>
          </div>
        ) : loading ? (
          <p className="text-muted text-center" style={{ padding: '40px 0' }}>Memuat data...</p>
        ) : restaurants.length > 0 ? (
          <div className="flex-col gap-3">
            {restaurants.map(item => (
              <RestaurantCard key={item.id} data={item} variant="horizontal" onAction={onSelectRestaurant} />
            ))}
          </div>
        ) : (
          <p className="text-muted text-center" style={{ padding: '40px 0' }}>Tidak ada restoran di kategori ini.</p>
        )}
      </div>
    </div>
  );
}
