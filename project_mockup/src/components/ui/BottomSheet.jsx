import React, { useState, useEffect, useMemo } from 'react';

export default function BottomSheet({ isOpen, onClose, restaurant, onConfirm, preSelectedPromoId = '' }) {
  const [guests, setGuests] = useState('2');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [tableType, setTableType] = useState('');     // area name (display)
  const [selectedAreaId, setSelectedAreaId] = useState(''); // area UUID (for DB)
  const [availabilityData, setAvailabilityData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [promos, setPromos] = useState([]);
  const [selectedPromoId, setSelectedPromoId] = useState('');

  const [startY, setStartY] = useState(null);
  const [currentY, setCurrentY] = useState(0);
  const [isClosing, setIsClosing] = useState(false);

  const dateOptions = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      let label = '';
      if (i === 0) label = 'Hari Ini';
      else if (i === 1) label = 'Besok';
      else label = d.toLocaleDateString('id-ID', { weekday: 'long' });
      
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      
      dates.push({
        dateStr: `${year}-${month}-${day}`,
        label,
        displayDate: d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
      });
    }
    return dates;
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setStartY(null);
      setCurrentY(0);
      setGuests('2');
      setTableType('');
      setSelectedAreaId('');
      setSelectedTime('');
      setErrorMsg('');
      setSelectedPromoId('');
      if (!selectedDate) setSelectedDate(dateOptions[0].dateStr);
    }
  }, [isOpen, dateOptions]);

  // Auto-select promo from promo detail screen
  useEffect(() => {
    if (isOpen && preSelectedPromoId) {
      setSelectedPromoId(preSelectedPromoId);
    }
  }, [isOpen, preSelectedPromoId]);

  useEffect(() => {
    if (isOpen && restaurant && restaurant.id && selectedDate) {
      setIsLoading(true);
      setErrorMsg('');
      fetch(`/api/restaurants/${restaurant.id}/availability?date=${selectedDate}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setAvailabilityData(data.availability);
          } else {
            setErrorMsg(data.error || 'Unknown error from API');
          }
          setIsLoading(false);
        })
        .catch(err => {
          setErrorMsg(err.message);
          setIsLoading(false);
        });
    } else if (isOpen) {
      if (!restaurant) setErrorMsg('No restaurant data');
      else if (!restaurant.id) setErrorMsg('No restaurant ID');
    }
    
    if (isOpen && restaurant && restaurant.id) {
      fetch(`/api/promos?restaurantId=${restaurant.id}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setPromos(data.filter(p => p.type === 'COLLAB'));
          }
        })
        .catch(console.error);
    }
  }, [isOpen, restaurant, selectedDate]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleConfirmClick = () => {
    if (!selectedDate || !guests || !selectedTime || !tableType) {
      alert('Mohon pilih Tanggal, Jam, dan Area.');
      return;
    }
    onConfirm({ guests: parseInt(guests), tableType, areaId: selectedAreaId, date: selectedDate, time: selectedTime, notes: '', promoId: selectedPromoId });
  };

  if (!isOpen) return null;

  const dragOffset = startY !== null ? Math.max(0, currentY - startY) : 0;
  const translateY = isClosing ? '100%' : `${dragOffset}px`;
  const transition = startY !== null ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

  return (
    <>
      <div className="bottom-sheet-overlay" onClick={handleClose} style={{ zIndex: 100 }}>
        <div 
          className="bottom-sheet" 
          onClick={e => e.stopPropagation()} 
          style={{ 
            padding: 0, height: '90%', display: 'flex', flexDirection: 'column',
            transform: `translateY(${translateY})`,
            transition: transition,
            background: '#F8FAFC'
          }}
        >
          {/* Header */}
          <div style={{ padding: '20px 20px 16px', background: 'white', display: 'flex', alignItems: 'center', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 10 }}>
            <div onClick={handleClose} style={{ cursor: 'pointer', marginRight: '16px' }}>
              <i className="ti ti-arrow-left" style={{ fontSize: '24px', color: '#1B3461' }}></i>
            </div>
            <h1 className="text-navy" style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>Pilih Waktu</h1>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
            
            {/* Dates Horizontal Scroll */}
            <div className="horizontal-scroll" style={{ paddingBottom: '8px', margin: '0 -20px 24px', paddingLeft: '20px', paddingRight: '20px' }}>
              {dateOptions.map(opt => (
                <div 
                  key={opt.dateStr}
                  onClick={() => {
                    setSelectedDate(opt.dateStr);
                    setSelectedTime('');
                    setTableType('');
                    setSelectedAreaId('');
                  }}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    padding: '12px 20px', borderRadius: '12px', minWidth: '100px', cursor: 'pointer',
                    background: selectedDate === opt.dateStr ? '#1B3461' : 'white',
                    border: '1px solid ' + (selectedDate === opt.dateStr ? '#1B3461' : '#E2E8F0'),
                    color: selectedDate === opt.dateStr ? 'white' : '#64748B',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>{opt.label}</div>
                  <div style={{ fontSize: '12px', fontWeight: 500, opacity: selectedDate === opt.dateStr ? 0.9 : 1 }}>{opt.displayDate}</div>
                </div>
              ))}
            </div>

            {/* Jumlah Orang Dropdown */}
            <h2 className="text-navy" style={{ fontSize: '15px', marginBottom: '12px' }}>Jumlah Orang</h2>
            <div style={{ marginBottom: '32px', position: 'relative' }}>
              <select 
                value={guests} 
                onChange={(e) => setGuests(e.target.value)}
                style={{
                  appearance: 'none',
                  width: '140px', padding: '12px 16px', borderRadius: '12px',
                  border: '1px solid #E2E8F0', background: 'white',
                  color: '#1B3461', fontSize: '15px', fontWeight: 700,
                  outline: 'none', cursor: 'pointer'
                }}
              >
                {[1,2,3,4,5,6,7,8,9,10,12,15,20].map(n => (
                  <option key={n} value={n}>{n} Orang</option>
                ))}
              </select>
              <i className="ti ti-chevron-down" style={{ position: 'absolute', left: '105px', top: '14px', color: '#1B3461', pointerEvents: 'none' }}></i>
            </div>

            {/* Time List */}
            <h2 className="text-navy" style={{ fontSize: '13px', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '12px' }}>Pilih Waktu (One Point)</h2>
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden', marginBottom: '32px' }}>
              {errorMsg ? (
                <div style={{ padding: '32px', textAlign: 'center', color: '#EF4444', fontSize: '14px', fontWeight: 600 }}>
                  Error: {errorMsg}
                </div>
              ) : isLoading ? (
                <div style={{ padding: '32px', textAlign: 'center', color: '#64748B' }}>Memuat ketersediaan...</div>
              ) : availabilityData.length === 0 ? (
                <div style={{ padding: '32px', textAlign: 'center', color: '#64748B' }}>Tidak ada jadwal tersedia.</div>
              ) : (
                availabilityData.map((slot, idx) => (
                  <div 
                    key={slot.time}
                    onClick={() => {
                      if (!slot.isFull) {
                        setSelectedTime(slot.time);
                        setTableType(''); // Reset area on time change
                        setSelectedAreaId('');
                      }
                    }}
                    style={{ 
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '16px', borderBottom: idx < availabilityData.length - 1 ? '1px solid #F1F5F9' : 'none',
                      background: selectedTime === slot.time ? '#F8FAFC' : 'white',
                      cursor: slot.isFull ? 'not-allowed' : 'pointer',
                      opacity: slot.isFull ? 0.6 : 1
                    }}
                  >
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#1B3461' }}>{slot.time}</div>
                    <div style={{ 
                      padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
                      background: slot.isFull ? '#FEF2F2' : '#ECFDF5',
                      color: slot.isFull ? '#EF4444' : '#10B981'
                    }}>
                      {slot.isFull ? 'Full' : `${slot.totalAvailable} Meja`}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Area Selection (Appears only after a time is selected) */}
            {selectedTime && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <h2 className="text-navy" style={{ fontSize: '15px', marginBottom: '12px' }}>Pilih Area Meja</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {(() => {
                    const slot = availabilityData.find(s => s.time === selectedTime);
                    if (!slot) return null;
                    
                    return Object.entries(slot.areas).map(([areaId, area]) => {
                      const isFull = area.available === 0;
                      return (
                        <div 
                          key={areaId}
                          onClick={() => { if (!isFull) { setTableType(area.name); setSelectedAreaId(areaId); } }}
                          style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '16px', borderRadius: '12px',
                            background: isFull ? '#F1F5F9' : tableType === area.name ? '#1B3461' : 'white',
                            border: '1px solid ' + (tableType === area.name ? '#1B3461' : '#E2E8F0'),
                            color: tableType === area.name ? 'white' : '#1B3461',
                            cursor: isFull ? 'not-allowed' : 'pointer',
                            opacity: isFull ? 0.6 : 1
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '15px', fontWeight: 700 }}>{area.name}</div>
                            <div style={{ fontSize: '12px', color: tableType === area.name ? '#93C5FD' : '#64748B', marginTop: '2px' }}>
                              Kapasitas: {area.allocated} Meja
                            </div>
                          </div>
                          <div style={{ 
                            padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
                            background: isFull ? '#FEF2F2' : tableType === area.name ? 'rgba(255,255,255,0.2)' : '#ECFDF5',
                            color: isFull ? '#EF4444' : tableType === area.name ? 'white' : '#10B981'
                          }}>
                            {isFull ? 'Full' : `${area.available} Meja`}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            )}
            
            {/* Promo Selection (Appears if Promos exist) */}
            {promos.length > 0 && selectedTime && (
              <div style={{ animation: 'fadeIn 0.3s ease', marginTop: '24px' }}>
                <h2 className="text-navy" style={{ fontSize: '15px', marginBottom: '12px' }}>Pilih Promo Kolaborasi (Opsional)</h2>
                <div style={{ marginBottom: '32px', position: 'relative' }}>
                  <select 
                    value={selectedPromoId} 
                    onChange={(e) => setSelectedPromoId(e.target.value)}
                    style={{
                      appearance: 'none',
                      width: '100%', padding: '16px 16px', borderRadius: '12px',
                      border: '1px solid #E2E8F0', background: 'white',
                      color: '#1B3461', fontSize: '15px', fontWeight: 600,
                      outline: 'none', cursor: 'pointer'
                    }}
                  >
                    <option value="">-- Tidak menggunakan promo --</option>
                    {promos.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                  <i className="ti ti-chevron-down" style={{ position: 'absolute', right: '16px', top: '16px', color: '#1B3461', pointerEvents: 'none' }}></i>
                </div>
              </div>
            )}
            
          </div>
  
          <div style={{ flexShrink: 0, padding: '16px 20px', background: 'white', borderTop: '1px solid #E2E8F0' }}>
            <button 
              className="btn-cta" 
              onClick={handleConfirmClick}
              disabled={!selectedTime || !tableType}
              style={{
                width: '100%', padding: '16px', borderRadius: '16px', border: 'none',
                background: (!selectedTime || !tableType) ? '#94A3B8' : '#0EA5A0',
                color: 'white', fontSize: '16px', fontWeight: 700, cursor: (!selectedTime || !tableType) ? 'not-allowed' : 'pointer',
                transition: 'background 0.3s ease'
              }}
            >
              Konfirmasi Booking
            </button>
          </div>
          
        </div>
      </div>
    </>
  );
}
