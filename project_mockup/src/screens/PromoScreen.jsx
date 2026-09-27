import React, { useState, useEffect } from 'react';

export default function PromoScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentBanner, setCurrentBanner] = useState(0);

  const banners = [
    {
      id: 1,
      badge: 'PROMO BULAN INI',
      title: 'Diskon hingga 50%\nuntuk reservasi pagi',
      subtitle: 'Sebelum jam 12.00',
      icon: 'ti-sun',
      image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80&w=600',
      gradient: 'linear-gradient(100deg, #024B51 0%, #036873 45%, transparent 60%)',
      btnColor: '#0EA5A0'
    },
    {
      id: 2,
      badge: 'WEEKEND SPESIAL',
      title: 'Gratis 1 Dessert\nuntuk dinner couple',
      subtitle: 'Berlaku Jumat - Minggu',
      icon: 'ti-glass-full',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=600',
      gradient: 'linear-gradient(100deg, #3B0764 0%, #6B21A8 45%, transparent 60%)',
      btnColor: '#9333EA'
    },
    {
      id: 3,
      badge: 'PAYDAY PROMO',
      title: 'Cashback 30%\npakai SeatoPay',
      subtitle: 'Maksimal Rp 50.000',
      icon: 'ti-coin',
      image: 'https://images.unsplash.com/photo-1543269664-56d93c1b41a6?auto=format&fit=crop&q=80&w=600',
      gradient: 'linear-gradient(100deg, #78350F 0%, #B45309 45%, transparent 60%)',
      btnColor: '#D97706'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 3500); // auto slide every 3.5 seconds
    return () => clearInterval(timer);
  }, [banners.length]);

  const categories = [
    { id: 'Event', label: 'Event', icon: 'ti-gift' },
    { id: 'B1G1', label: 'Buy 1 Get 1', icon: 'ti-math-1-divide-2' },
    { id: 'Bundle', label: 'Bundle', icon: 'ti-shopping-bag' },
    { id: 'Discount', label: 'Discount', icon: 'ti-discount-2' },
    { id: 'Cashback', label: 'Cashback', icon: 'ti-coin' },
    { id: 'Birthday', label: 'Birthday', icon: 'ti-cake' }
  ];

  const nearbyPromos = [
    {
      id: 1,
      tag: 'EVENT',
      title: 'Live Music Every Friday',
      resto: 'Kopi Anjungan',
      distance: '1.5 km',
      desc: 'Nikmati live music spesial setiap hari Jumat.',
      date: 'Berlaku s/d 31 Jul 2024',
      image: 'https://images.unsplash.com/photo-1543269664-56d93c1b41a6?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 2,
      tag: 'BUY 1 GET 1',
      title: 'Buy 1 Get 1 All Beverages',
      resto: 'Dapoer Nona',
      distance: '1.2 km',
      desc: 'Beli 1 minuman, gratis 1 minuman (varian sama).',
      date: 'Berlaku s/d 15 Jul 2024',
      image: 'https://images.unsplash.com/photo-1557142046-c704a3adf364?auto=format&fit=crop&q=80&w=400'
    }
  ];

  const allPromos = [
    {
      id: 3,
      tag: 'BUNDLE',
      title: 'Paket Hemat Berdua',
      resto: 'Resto Kita',
      distance: '1.3 km',
      desc: '2 Main Course + 2 Drink hanya Rp120.000',
      date: 'Berlaku s/d 20 Jul 2024',
      image: 'https://images.unsplash.com/photo-1605333396914-2c35805500e5?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 4,
      tag: 'DISCOUNT',
      title: 'Diskon 25%',
      resto: 'Soto Kudus Menara',
      distance: '1.2 km',
      desc: 'Diskon 25% untuk semua menu makanan',
      date: 'Berlaku s/d 31 Jul 2024',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 5,
      tag: 'CASHBACK',
      title: 'Cashback 20%',
      resto: 'Kopi Anjungan',
      distance: '1.5 km',
      desc: 'Dapatkan cashback 20% (max Rp25.000)',
      date: 'Berlaku s/d 28 Jul 2024',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 6,
      tag: 'BIRTHDAY',
      title: 'Diskon Spesial Ultah',
      resto: 'Semua Restoran',
      distance: '-',
      desc: 'Dapatkan diskon 30% di hari ulang tahunmu!',
      date: 'Berlaku di bulan ultahmu',
      image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=400'
    }
  ];

  return (
    <div className="screen-content bg-white pb-24">
      
      {/* Header Section */}
      <div className="promo-header-solid">
        <div style={{ padding: '0 20px' }}>
          {/* Header Title & Bell */}
          <div className="flex-row justify-between items-center mb-5">
            <h1 className="m-0 font-bold" style={{ fontSize: '24px', color: 'white', letterSpacing: '-0.5px' }}>Promo</h1>
            <div className="relative">
              <i className="ti ti-bell" style={{ fontSize: '22px', color: 'white' }}></i>
              <span className="badge-dot-header"></span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="promo-search-bar-solid">
            <i className="ti ti-search" style={{ color: '#94A3B8', fontSize: '20px' }}></i>
            <input 
              type="text" 
              placeholder="Cari promo, restoran, atau kode..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: '13px', background: 'transparent', color: '#1B3461' }}
            />
          </div>
        </div>
      </div>
      
      <div style={{ position: 'relative', zIndex: 2, marginTop: '-60px' }}>
        {/* Main Banner Slider */}
        <div style={{ padding: '0 20px', marginBottom: '28px', position: 'relative' }}>
          <div className="promo-banner-card">
            <div 
              className="promo-banner-bg" 
              style={{ 
                backgroundImage: `url(${banners[currentBanner].image})`,
              }}
            ></div>
            <div 
              className="promo-banner-gradient" 
              style={{ background: banners[currentBanner].gradient }}
            ></div>
            
            <div className="promo-banner-content-new">
              <span className="promo-banner-badge-new">{banners[currentBanner].badge}</span>
              <h2 className="promo-banner-title">
                {banners[currentBanner].title}
              </h2>
              <div className="promo-banner-subtitle">
                <i className={`ti ${banners[currentBanner].icon}`}></i> {banners[currentBanner].subtitle}
              </div>
              <button className="promo-banner-btn" style={{ background: banners[currentBanner].btnColor }}>
                Klaim Sekarang <i className="ti ti-chevron-right ml-1"></i>
              </button>
            </div>
            
            {/* Dots */}
            <div className="promo-banner-dots">
              {banners.map((_, idx) => (
                <div 
                  key={idx}
                  className={`banner-dot ${idx === currentBanner ? 'active' : ''}`}
                  onClick={() => setCurrentBanner(idx)}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="section-title-new" style={{ padding: '0 20px' }}>Jenis Promo</h2>
          <div className="horizontal-scroll hide-scrollbar" style={{ padding: '0 20px', gap: '12px' }}>
            {categories.map((cat, i) => (
              <div key={cat.id} className={`promo-cat-box ${i === 0 ? 'active' : ''}`}>
                <i className={`ti ${cat.icon}`}></i>
                <span>{cat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Promo Terdekat */}
        <div className="mb-8">
          <div className="flex-row justify-between items-center mb-4" style={{ padding: '0 20px' }}>
            <h2 className="section-title-new m-0">Promo Terdekat</h2>
            <span className="section-link">
              Lihat semua <i className="ti ti-chevron-right"></i>
            </span>
          </div>
          <div className="horizontal-scroll hide-scrollbar" style={{ padding: '0 20px', gap: '16px' }}>
            {nearbyPromos.map(promo => (
              <div key={promo.id} className="promo-card-horiz">
                <div className="promo-card-horiz-img" style={{ backgroundImage: `url(${promo.image})` }}>
                  <span className="promo-card-horiz-tag">{promo.tag}</span>
                </div>
                <div className="promo-card-horiz-body">
                  <h3 className="promo-card-horiz-title">{promo.title}</h3>
                  <div className="promo-card-horiz-resto">
                    <span className="resto-name">{promo.resto}</span>
                    <span className="resto-dist"><i className="ti ti-map-pin"></i> {promo.distance}</span>
                  </div>
                  <p className="promo-card-horiz-desc">{promo.desc}</p>
                  <div className="promo-card-horiz-date">
                    <i className="ti ti-calendar"></i> {promo.date}
                  </div>
                  <button className="promo-card-horiz-btn">
                    Lihat Detail
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Voucher Block */}
        <div className="mb-8" style={{ padding: '0 20px' }}>
          <div className="voucher-block-dark">
            <div className="voucher-block-left">
              <i className="ti ti-ticket voucher-icon-dark"></i>
              <div className="flex-col">
                <span className="voucher-label-dark">Voucher Saya</span>
                <span className="voucher-val-dark">3 <span style={{ fontSize: '12px', fontWeight: 500, color: '#CBD5E1' }}>Voucher Aktif</span></span>
              </div>
            </div>
            <div className="voucher-block-divider"></div>
            <div className="voucher-block-right">
              <i className="ti ti-receipt-2 voucher-icon-dark" style={{ opacity: 0.8 }}></i>
              <div className="flex-col" style={{ flex: 1, gap: '2px' }}>
                <span className="voucher-label-dark" style={{ fontWeight: 600, color: 'white', fontSize: '12px' }}>Riwayat Penggunaan</span>
                <span className="voucher-sub-dark">Lihat semua voucher yang<br/>pernah digunakan</span>
              </div>
              <i className="ti ti-chevron-right" style={{ color: 'white', opacity: 0.8, fontSize: '18px' }}></i>
            </div>
          </div>
        </div>

        {/* Semua Promo */}
        <div className="mb-8">
          <div className="flex-row justify-between items-center mb-4" style={{ padding: '0 20px' }}>
            <h2 className="section-title-new m-0">Semua Promo</h2>
            <span className="section-link">
              Lihat semua <i className="ti ti-chevron-right"></i>
            </span>
          </div>
          
          <div style={{ padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {allPromos.map(promo => (
              <div key={promo.id} className="promo-card-grid">
                <div className="promo-card-grid-img" style={{ backgroundImage: `url(${promo.image})` }}>
                  <span className="promo-card-grid-tag">{promo.tag}</span>
                </div>
                <div className="promo-card-grid-body">
                  <h3 className="promo-card-grid-title">{promo.title}</h3>
                  <div className="promo-card-grid-resto">
                    <span className="flex-row items-center gap-1"><i className="ti ti-map-pin"></i> {promo.resto}</span>
                  </div>
                  <p className="promo-card-grid-desc">{promo.desc}</p>
                  <div className="promo-card-grid-date">
                    <i className="ti ti-calendar"></i> {promo.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Masukkan Kode Promo */}
        <div className="mb-10" style={{ padding: '0 20px' }}>
          <div className="promo-code-card-teal">
            <div className="flex-row items-center gap-4">
              <i className="ti ti-gift promo-code-icon-teal"></i>
              <div className="flex-col" style={{ gap: '2px' }}>
                <span className="promo-code-title-teal">Masukkan kode promo</span>
                <span className="promo-code-sub-teal">Punya kode promo? Yuk, tukarkan sekarang!</span>
              </div>
            </div>
            <button className="promo-code-btn-teal">Gunakan Kode</button>
          </div>
        </div>

      </div>
    </div>
  );
}
