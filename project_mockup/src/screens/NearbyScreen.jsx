import React, { useState, useEffect } from 'react';
import RestaurantCard from '../components/ui/RestaurantCard';

export default function NearbyScreen({ onBack, onSelectRestaurant }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // using nearby parameter to calculate distance on server
    fetch('/api/restaurants?nearby=true')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRestaurants(data);
        }
        setLoading(false);
      });
  }, []);

  return (
    <div className="screen-content bg-gray-50" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 100, overflowY: 'auto' }}>
      <div className="flex-row justify-between items-center" style={{ padding: '16px 16px 12px', position: 'sticky', top: 0, background: 'rgba(248, 250, 252, 0.85)', backdropFilter: 'blur(12px)', zIndex: 20 }}>
        <div className="icon-btn-modern" onClick={onBack} style={{ background: '#FFFFFF', color: '#1B3461', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', width: '36px', height: '36px' }}>
          <i className="ti ti-arrow-left" style={{ fontSize: '18px' }}></i>
        </div>
        <div className="flex-col items-center">
          <h2 className="text-navy font-bold m-0" style={{ fontSize: '16px', letterSpacing: '-0.1px' }}>Terdekat</h2>
          <p className="m-0 text-primary" style={{ fontSize: '10px', fontWeight: '700' }}>Radius 10 KM</p>
        </div>
        <div style={{ width: '36px' }}></div> {/* Spacer to center title */}
      </div>

      <div style={{ padding: '12px 16px' }}>
        {loading ? (
          <p className="text-muted text-center" style={{ padding: '40px 0' }}>Memuat data...</p>
        ) : restaurants.length > 0 ? (
          <div className="flex-col gap-3">
            {restaurants.map(item => (
              <RestaurantCard key={item.id} data={item} variant="horizontal" onAction={onSelectRestaurant} />
            ))}
          </div>
        ) : (
          <p className="text-muted text-center" style={{ padding: '40px 0' }}>Tidak ada restoran terdekat dalam radius 10 km.</p>
        )}
      </div>
    </div>
  );
}
