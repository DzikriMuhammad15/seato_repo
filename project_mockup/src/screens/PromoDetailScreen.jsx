import React, { useState, useEffect } from 'react';

export default function PromoDetailScreen({ promo, onBack, onBooking, onSelectRestaurant }) {
  const [promoDetail, setPromoDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (promo?.id) {
      setIsLoading(true);
      fetch(`/api/promos/${promo.id}`)
        .then(res => res.json())
        .then(data => {
          if (!data.error) setPromoDetail(data);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [promo?.id]);

  if (!promo) return null;

  const detail = promoDetail || promo;
  const restaurant = promoDetail?.restaurant;

  // Compute occupancy for the restaurant if available
  let occPct = 0;
  let statusLabel = 'Available';
  let statusColor = '#10B981';
  let isSeatoFull = false;

  if (restaurant?.areas?.length > 0) {
    let seatoOccupied = 0;
    let seatoAllocated = 0;
    let totalSeats = 0;
    let filledSeats = 0;

    restaurant.areas.forEach(a => {
      seatoOccupied += a.seatoOccupied;
      seatoAllocated += a.seatoAllocated;
      totalSeats += a.total;
      filledSeats += a.seatoOccupied + a.walkInOccupied;
    });

    occPct = totalSeats > 0 ? Math.round((filledSeats / totalSeats) * 100) : 0;
    statusLabel = occPct >= 90 ? 'Full' : occPct >= 60 ? 'Busy' : 'Available';
    statusColor = occPct >= 90 ? '#EF4444' : occPct >= 60 ? '#F59E0B' : '#10B981';
    isSeatoFull = seatoAllocated > 0 ? seatoOccupied >= seatoAllocated : true;
  }

  const handleReservasi = () => {
    if (restaurant) {
      onBooking(restaurant, detail.id);
    }
  };

  const handleViewRestaurant = () => {
    if (restaurant && onSelectRestaurant) {
      onSelectRestaurant(restaurant);
    }
  };

  return (
    <div className="screen-content" style={{ paddingBottom: 0, position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', background: '#F8FAFC' }}>
      
      {/* Hero Banner */}
      <div style={{
        position: 'relative',
        height: '300px',
        backgroundImage: detail.imageUrl 
          ? `${detail.color || 'linear-gradient(135deg, rgba(0,0,0,0.3), rgba(0,0,0,0.7))'}, url(${detail.imageUrl})`
          : detail.color || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end'
      }}>
        {/* Back & Badge */}
        <div style={{ position: 'absolute', top: '56px', left: '20px', right: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 10 }}>
          <div 
            onClick={onBack}
            style={{ width: '40px', height: '40px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}
          >
            <i className="ti ti-arrow-left" style={{ fontSize: '20px' }}></i>
          </div>
          {detail.type === 'COLLAB' && (
            <div style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, color: 'white', letterSpacing: '0.05em' }}>
              PROMO KOLABORASI
            </div>
          )}
        </div>

        {/* Promo Title Overlay */}
        <div style={{ padding: '32px 24px 28px', background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'white', margin: 0, lineHeight: '1.3', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
            {detail.title}
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', marginTop: '8px', lineHeight: '1.5' }}>
            {detail.subtitle}
          </p>
        </div>
      </div>

      {/* Detail Content */}
      <div style={{ flex: 1, background: '#FFFFFF', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', marginTop: '-24px', position: 'relative', zIndex: 5, padding: '28px 24px', overflowY: 'auto', paddingBottom: '120px' }}>
        
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748B' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid #E2E8F0', borderTopColor: '#0EA5A0', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }}></div>
            Memuat detail promo...
          </div>
        ) : (
          <>
            {/* Promo Code Badge (for COLLAB) */}
            {detail.type === 'COLLAB' && detail.code && (
              <div style={{ 
                background: 'linear-gradient(135deg, #F0FDFA 0%, #CCFBF1 100%)', 
                border: '2px dashed #0EA5A0', 
                borderRadius: '16px', 
                padding: '20px', 
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{ width: '48px', height: '48px', background: '#0EA5A0', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className="ti ti-ticket" style={{ fontSize: '24px', color: 'white' }}></i>
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', letterSpacing: '0.05em', marginBottom: '4px' }}>KODE PROMO</div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: '#0EA5A0', letterSpacing: '0.08em' }}>{detail.code}</div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>Tunjukkan kode ini saat kedatangan</div>
                </div>
              </div>
            )}

            {/* Promo Info */}
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#1B3461', marginBottom: '12px' }}>Detail Promo</h2>
              <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.7' }}>
                {detail.subtitle}
              </p>
              {detail.type === 'GLOBAL' && (
                <div style={{ marginTop: '12px', padding: '12px 16px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="ti ti-info-circle" style={{ fontSize: '16px', color: '#0EA5A0' }}></i>
                    Promo ini berlaku untuk semua restoran partner SEATO.
                  </div>
                </div>
              )}
            </div>

            {/* Restaurant Info (for COLLAB promos) */}
            {detail.type === 'COLLAB' && restaurant && (
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#1B3461', marginBottom: '16px' }}>Restoran Partner</h2>
                
                <div 
                  onClick={handleViewRestaurant}
                  style={{ 
                    background: 'white', 
                    borderRadius: '16px', 
                    border: '1px solid #E2E8F0', 
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
                  }}
                >
                  {/* Restaurant Image */}
                  {restaurant.imageUrl && (
                    <div style={{ 
                      height: '140px', 
                      backgroundImage: `url(${restaurant.imageUrl})`, 
                      backgroundSize: 'cover', 
                      backgroundPosition: 'center',
                      position: 'relative'
                    }}>
                      <div style={{ 
                        position: 'absolute', bottom: '12px', right: '12px',
                        background: statusColor, color: 'white', 
                        padding: '4px 12px', borderRadius: '20px', 
                        fontSize: '11px', fontWeight: 700
                      }}>
                        {statusLabel} • {occPct >= 90 ? occPct : (100 - occPct)}%
                      </div>
                    </div>
                  )}
                  
                  {/* Restaurant Info */}
                  <div style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#1B3461', margin: 0 }}>
                        {restaurant.name}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', flexShrink: 0 }}>
                        <i className="ti ti-star-filled" style={{ color: '#FACC15', fontSize: '14px' }}></i>
                        <span style={{ fontWeight: 800, color: '#1B3461' }}>{restaurant.rating}</span>
                        <span style={{ color: '#64748B', fontSize: '12px' }}>({restaurant.reviewsCount})</span>
                      </div>
                    </div>
                    
                    <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '12px' }}>
                      {restaurant.type} • {restaurant.distance || '-'} • {restaurant.city}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '6px 12px', borderRadius: '8px',
                        background: '#F1F5F9', fontSize: '12px', color: '#1B3461', fontWeight: 600
                      }}>
                        <i className="ti ti-map-pin" style={{ fontSize: '14px' }}></i>
                        {restaurant.address}
                      </div>
                    </div>

                    {/* Lihat Detail link */}
                    <div style={{ 
                      marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #F1F5F9',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                    }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#0EA5A0' }}>
                        Lihat Detail Restoran
                      </span>
                      <i className="ti ti-chevron-right" style={{ fontSize: '16px', color: '#0EA5A0' }}></i>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Terms & Conditions */}
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#1B3461', marginBottom: '12px' }}>Syarat & Ketentuan</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  'Promo berlaku untuk reservasi melalui aplikasi SEATO',
                  'Tidak dapat digabungkan dengan promo lainnya',
                  'Berlaku selama persediaan masih ada',
                  detail.type === 'COLLAB' ? 'Tunjukkan kode promo saat kedatangan' : 'Berlaku di semua restoran partner'
                ].map((term, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '10px', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                      <i className="ti ti-check" style={{ fontSize: '12px', color: '#10B981' }}></i>
                    </div>
                    <span style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.5' }}>{term}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Sticky Bottom CTA */}
      {detail.type === 'COLLAB' && restaurant && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'white', padding: '16px 24px 32px', borderTop: '1px solid #E2E8F0', zIndex: 20 }}>
          {isSeatoFull ? (
            <button 
              className="btn-cta" 
              style={{ background: '#E2E8F0', color: '#64748B' }} 
              disabled
            >
              Kuota Reservasi Penuh
            </button>
          ) : (
            <button 
              className="btn-cta" 
              style={{ 
                background: 'linear-gradient(135deg, #0EA5A0 0%, #14B8A6 100%)', 
                color: 'white',
                boxShadow: '0 4px 16px rgba(14, 165, 160, 0.3)'
              }} 
              onClick={handleReservasi}
            >
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <i className="ti ti-calendar-event" style={{ fontSize: '20px' }}></i>
                Reservasi di {restaurant.name}
              </span>
            </button>
          )}
        </div>
      )}

      {/* Spinner animation */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
