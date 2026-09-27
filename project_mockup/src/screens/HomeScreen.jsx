import React, { useState, useEffect } from 'react';
import RestaurantCard from '../components/ui/RestaurantCard';

export default function HomeScreen({ onSearch, onSelectRestaurant, onSelectPromo, onOpenCategory, onOpenNearby, currentUser }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [promoBanners, setPromoBanners] = useState([]);

  useEffect(() => {
    fetch('/api/restaurants')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setRestaurants(data); });
      
    fetch('/api/promos')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setPromoBanners(data); });
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  const categories = [
    { id: 'Semua', label: 'Semua', icon: 'ti-border-all' },
    { id: 'Trending', label: 'Trending', icon: 'ti-flame', soon: true },
    { id: 'Top Chart', label: 'Top Chart', icon: 'ti-chart-bar', soon: true },
    { id: 'WFC friendly', label: 'WFC Friendly', icon: 'ti-device-laptop' },
    { id: 'Smoking Indoor', label: 'Smoking In', icon: 'ti-smoking' },
    { id: 'Fine dining', label: 'Fine Dining', icon: 'ti-glass-full' },
    { id: '24 hours', label: '24 Hours', icon: 'ti-clock-24' },
    { id: 'late night', label: 'Late Night', icon: 'ti-moon' },
    { id: 'Pets friendly', label: 'Pet Friendly', icon: 'ti-paw' },
    { id: 'new commers', label: 'New Commers', icon: 'ti-confetti' }
  ];

  // Calculate nearby top 5
  const nearbyRestaurants = [...restaurants]
    .filter(r => r.calculatedDistance != null && r.calculatedDistance <= 10)
    .sort((a, b) => a.calculatedDistance - b.calculatedDistance)
    .slice(0, 5);

  return (
    <div className="screen-content bg-gray-50 pb-20">
      <div className="home-header" style={{ paddingTop: '50px', paddingBottom: '15px', borderBottomLeftRadius: '28px', borderBottomRightRadius: '28px', boxShadow: '0 8px 32px rgba(15,23,42,0.18)', position: 'relative', overflow: 'hidden' }}>
        {/* Aurora background effect */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(160deg, #131e36 0%, #1B3461 40%, #1a2744 70%, #131e36 100%)', zIndex: 0 }} />
        {/* Aurora streak 1 - teal/cyan (top right) */}
        <div style={{ position: 'absolute', top: '-30%', right: '-20%', width: '80%', height: '90%', background: 'radial-gradient(ellipse at center, rgba(14,165,160,0.35) 0%, rgba(14,165,160,0.12) 45%, transparent 70%)', filter: 'blur(20px)', transform: 'rotate(-20deg)', zIndex: 0 }} />
        {/* Aurora streak 2 - purple/violet (left center) */}
        <div style={{ position: 'absolute', top: '10%', left: '-20%', width: '70%', height: '80%', background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.3) 0%, rgba(139,92,246,0.1) 45%, transparent 70%)', filter: 'blur(18px)', transform: 'rotate(8deg)', zIndex: 0 }} />
        {/* Aurora streak 3 - pink/magenta (bottom right) */}
        <div style={{ position: 'absolute', bottom: '-15%', right: '0%', width: '65%', height: '70%', background: 'radial-gradient(ellipse at center, rgba(236,72,153,0.2) 0%, rgba(236,72,153,0.06) 45%, transparent 70%)', filter: 'blur(22px)', transform: 'rotate(5deg)', zIndex: 0 }} />
        {/* Aurora streak 4 - gold shimmer (center) */}
        <div style={{ position: 'absolute', top: '35%', right: '20%', width: '50%', height: '50%', background: 'radial-gradient(ellipse at center, rgba(250,204,21,0.12) 0%, transparent 55%)', filter: 'blur(15px)', zIndex: 0 }} />

        <div className="flex-row justify-between items-center" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'linear-gradient(135deg, #0EA5A0, #0D8F8B)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(14,165,160,0.4)' }}>
              <span style={{ fontWeight: 800, fontSize: '16px', color: 'white' }}>S</span>
            </div>
            <h1 className="font-bold m-0" style={{ fontSize: '22px', color: 'white', letterSpacing: '-0.3px' }}>Seato</h1>
          </div>
          <div className="icon-btn-modern" style={{ backdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.12)' }}>
            <i className="ti ti-bell" style={{ fontSize: '22px' }}></i>
            <span className="badge-dot"></span>
          </div>
        </div>

        <div style={{ marginTop: '28px', position: 'relative', zIndex: 2 }}>
          <p className="m-0" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', fontWeight: 500, letterSpacing: '0.3px', textTransform: 'uppercase' }}>Selamat pagi 👋</p>
          <h1 className="m-0" style={{ fontSize: '26px', lineHeight: '1.25', color: 'white', fontWeight: 800, marginTop: '6px', letterSpacing: '-0.5px' }}>
            Halo, {currentUser?.name?.split(' ')[0] || 'Foodie'}!
          </h1>
          <p className="m-0" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', marginTop: '4px', fontWeight: 400 }}>Mau makan di mana hari ini?</p>
        </div>
        
        {/* Glassmorphism Search Bar */}
        <div style={{ marginTop: '24px', position: 'relative', zIndex: 2, background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(16px)', borderRadius: '18px', height: '54px', display: 'flex', alignItems: 'center', padding: '0 8px 0 18px', gap: '12px', border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <i className="ti ti-search" style={{ fontSize: '20px', color: 'rgba(255,255,255,0.5)' }}></i>
          <input 
            type="text" 
            placeholder="Cari restoran, cafe..." 
            value={searchQuery}
            onChange={handleSearch}
            style={{ border: 'none', outline: 'none', flex: 1, fontSize: '14px', color: 'white', background: 'transparent', fontWeight: 500 }}
          />
          <div style={{ width: '38px', height: '38px', background: '#0EA5A0', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(14,165,160,0.3)' }}>
            <i className="ti ti-adjustments-horizontal" style={{ color: 'white', fontSize: '18px' }}></i>
          </div>
        </div>
        
        <div style={{ marginTop: '16px', display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', padding: '8px 14px', borderRadius: '20px', position: 'relative', zIndex: 2 }}>
          <i className="ti ti-map-pin" style={{ color: '#0EA5A0', fontSize: '16px' }}></i> 
          <span style={{ fontSize: '13px', color: 'white', fontWeight: 600 }}>{currentUser?.location?.split(',')[0] || 'Jakarta'}</span> 
          <i className="ti ti-chevron-down" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}></i>
        </div>
      </div>

      {/* Categories Section */}
      <div style={{ padding: '6px 0 2px' }}>
        <h2 style={{ padding: '0 20px', marginBottom: '8px', fontSize: '14px' }} className="section-title">Kategori</h2>
        <div className="horizontal-scroll hide-scrollbar pl-5 pr-5" style={{ gap: '8px' }}>
          {categories.map(cat => (
            <div 
              key={cat.id} 
              className="category-pill-sleek"
              onClick={() => onOpenCategory(cat.id)}
            >
              <span className="category-text">{cat.label}</span>
              {cat.soon && <span className="cat-badge-inline">SOON</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Terdekat (Nearby) Section */}
      <div style={{ padding: '6px 20px 10px' }}>
        <div className="flex-row justify-between items-center" style={{ marginBottom: '8px' }}>
          <h2 className="section-title" style={{ fontSize: '14px' }}>Terdekat dari kamu</h2>
          <span className="text-primary text-sm font-medium cursor-pointer" onClick={onOpenNearby}>Lihat semua</span>
        </div>
        <div className="flex-col" style={{ gap: '8px' }}>
          {nearbyRestaurants.map((item) => (
            <RestaurantCard key={item.id} data={item} variant="horizontal" onAction={onSelectRestaurant} />
          ))}
          {nearbyRestaurants.length === 0 && (
            <p className="text-muted text-sm text-center py-4 bg-white rounded-xl border border-gray-100">Tidak ada restoran dalam radius 10 km.</p>
          )}
        </div>
      </div>

      {/* Promo Section moved down here */}
      <div style={{ padding: '4px 0 16px' }}>
        <h2 style={{ padding: '0 20px', marginBottom: '10px' }} className="section-title">Promo Spesial</h2>
        <div className="horizontal-scroll hide-scrollbar pl-5 pr-5">
          {promoBanners.map(promo => (
            <div 
              key={promo.id} 
              className="promo-card-modern" 
              style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7)), url(${promo.imageUrl})` }}
              onClick={() => onSelectPromo && onSelectPromo(promo)}
            >
              {promo.type === 'COLLAB' && (
                <div className="promo-badge">PROMO KOLABORASI</div>
              )}
              <div className="promo-content-modern">
                <h2 className="promo-title">{promo.title}</h2>
                <p className="promo-subtitle">{promo.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
