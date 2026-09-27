"use client";
import React from 'react';
import { IconSearch, IconFilter, IconCheck, IconX, IconCalendarEvent, IconClockX, IconCircleCheck } from '@tabler/icons-react';

export default function AdminReservations() {
  const [reservations, setReservations] = React.useState([]);
  const [checkoutModalOpen, setCheckoutModalOpen] = React.useState(false);
  const [selectedResForCheckout, setSelectedResForCheckout] = React.useState(null);

  const [approveModalOpen, setApproveModalOpen] = React.useState(false);
  const [selectedResForApprove, setSelectedResForApprove] = React.useState(null);
  const [assignedTable, setAssignedTable] = React.useState('');

  React.useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = () => {
    // Filter by logged-in restaurant
    const restaurantId = localStorage.getItem('partnerRestoId');
    const url = restaurantId 
      ? `/api/admin/reservations?restaurantId=${restaurantId}` 
      : '/api/admin/reservations';

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setReservations(data);
      })
      .catch(console.error);
  };

  const handleAction = async (id, status, cancelledBy = null) => {
    try {
      const body = { status };
      if (cancelledBy) body.cancelledBy = cancelledBy;
      
      await fetch(`/api/reservations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      fetchReservations(); // Refresh
    } catch(e) {
      console.error(e);
    }
  };

  const getStatusChipClass = (status) => {
    switch (status) {
      case 'Confirmed': return 'chip-confirmed';
      case 'Sedang Makan': return 'chip-confirmed'; // Reuse same visual or customize later
      case 'Selesai': return 'chip-confirmed';
      case 'Dibatalkan': return 'chip-cancelled';
      case 'Ditolak Restoran': return 'chip-cancelled';
      default: return 'chip-waiting';
    }
  };

  const openCheckoutModal = (resId) => {
    setSelectedResForCheckout(resId);
    setCheckoutModalOpen(true);
  };

  const handleCheckoutConfirm = async () => {
    if (selectedResForCheckout) {
      await handleAction(selectedResForCheckout, 'Selesai');
      setCheckoutModalOpen(false);
      setSelectedResForCheckout(null);
    }
  };

  const getTableStatus = (area) => {
    if (!area) return [];
    
    const tables = [];
    const areaWalkInQuota = area.total - area.seatoAllocated;
    
    for (let i = 0; i < area.total; i++) {
      const isSeatoZone = i < area.seatoAllocated;
      let isSeato = false;
      let isWalkIn = false;
      let isOverflowWalkin = false;

      if (isSeatoZone) {
        isSeato = i < area.seatoOccupied;
        if (!isSeato) {
          const overflowCount = Math.max(0, area.walkInOccupied - areaWalkInQuota);
          if (overflowCount > 0) {
            const emptyInSeatoZone = area.seatoAllocated - area.seatoOccupied;
            const overflowInSeatoZone = Math.min(overflowCount, emptyInSeatoZone);
            isOverflowWalkin = (i - area.seatoOccupied) < overflowInSeatoZone;
            isWalkIn = isOverflowWalkin;
          }
        }
      } else {
        const walkInZoneIndex = i - area.seatoAllocated;
        const normalWalkIn = Math.min(area.walkInOccupied, areaWalkInQuota);
        isWalkIn = walkInZoneIndex < normalWalkIn;
      }
      
      const isExplicit = reservations.some(r => 
        r.areaId === area.id && 
        (r.status === 'Confirmed' || r.status === 'Sedang Makan') && 
        r.assignedTable === `Meja ${i + 1}`
      );

      let status = 'available';
      if (isExplicit || isSeato) status = 'seato';
      else if (isWalkIn) status = 'walk-in';
      
      tables.push({ number: i + 1, status });
    }
    return tables;
  };

  const openApproveModal = (res) => {
    setSelectedResForApprove(res);
    setAssignedTable('');
    setApproveModalOpen(true);
  };

  const handleApproveConfirm = async () => {
    if (selectedResForApprove) {
      if (!assignedTable || assignedTable.trim() === '') {
        alert("Nomor meja harus diisi!");
        return;
      }
      try {
        await fetch(`/api/reservations/${selectedResForApprove.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'Confirmed', assignedTable: assignedTable.trim() })
        });
        fetchReservations();
        setApproveModalOpen(false);
        setSelectedResForApprove(null);
      } catch(e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="screen-content" style={{ background: '#F8FAFC' }}>
      <div style={{ width: '100%', minHeight: '100vh', background: '#F8FAFC' }}>
      <div style={{ background: 'white', padding: '32px 32px 24px', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Reservations</h1>
        
        <div style={{ display: 'flex', gap: '12px', width: '400px' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: '#F1F5F9', borderRadius: '12px', padding: '0 16px', height: '44px' }}>
            <IconSearch size={18} color="#94A3B8" />
            <input 
              type="text" 
              placeholder="Search by ID or name..." 
              style={{ border: 'none', background: 'transparent', outline: 'none', marginLeft: '12px', fontSize: '14px', width: '100%' }}
            />
          </div>
          <button style={{ width: '44px', height: '44px', background: '#1B3461', color: 'white', border: 'none', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <IconFilter size={20} />
          </button>
        </div>
      </div>

      <div style={{ padding: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px' }}>
        {reservations.map((res) => (
          <div key={res.id} style={{ background: 'white', borderRadius: '16px', padding: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #F1F5F9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <span className={`chip ${getStatusChipClass(res.status)}`}>
                  {res.status}
                </span>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '6px' }}>#{res.id.substring(0, 8)}</div>
              </div>
              {/* <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>Rp {res.totalAmount?.toLocaleString() || '-'}</div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>{res.paymentStatus}</div>
              </div> */}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1B3461' }}>
                  <IconCalendarEvent size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>{res.user?.name || 'Guest'}</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>
                    {res.date} • {res.time} • {res.guests} Pax • {res.tableType}
                    {res.assignedTable && ` • Meja: ${res.assignedTable}`}
                  </div>
                </div>
              </div>
              
              {/* Show promo if exists */}
              {res.promo && (
                <div style={{ fontSize: '12px', color: '#0EA5A0', background: '#F0FDFA', padding: '8px 12px', borderRadius: '8px', marginTop: '4px' }}>
                  <strong>Promo Digunakan:</strong> {res.promo.code} ({res.promo.title})
                </div>
              )}
              
              {/* Show cancel reason if exists */}
              {res.cancelReason && (
                <div style={{ fontSize: '12px', color: '#EF4444', background: '#FEF2F2', padding: '8px 12px', borderRadius: '8px', marginTop: '4px' }}>
                  <strong>Alasan:</strong> {res.cancelReason}
                  {res.cancelledBy && (
                    <span style={{ color: '#64748B', marginLeft: '8px' }}>
                      (oleh {res.cancelledBy === 'user' ? 'User' : res.cancelledBy === 'admin' ? 'Admin' : 'Sistem'})
                    </span>
                  )}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px', borderTop: '1px dashed #E2E8F0', paddingTop: '16px' }}>
              {/* Menunggu Konfirmasi: Approve + Reject */}
              {res.status === 'Menunggu Konfirmasi' && (
                <>
                  <button onClick={() => openApproveModal(res)} style={{ flex: 1, padding: '10px', background: '#DCFCE7', color: '#16A34A', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', cursor: 'pointer' }}>
                    <IconCheck size={16} /> Approve
                  </button>
                  <button onClick={() => handleAction(res.id, 'Ditolak Restoran', 'admin')} style={{ flex: 1, padding: '10px', background: '#FEF3C7', color: '#92400E', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', cursor: 'pointer' }}>
                    <IconX size={16} /> Reject
                  </button>
                </>
              )}
              
              {/* Confirmed: Check-In button & Cancel button */}
              {res.status === 'Confirmed' && (
                <>
                  <button onClick={() => {
                    if(confirm('Yakin ingin membatalkan reservasi ini? Kuota meja akan dikembalikan.')) {
                      handleAction(res.id, 'Dibatalkan', 'admin');
                    }
                  }} style={{ flex: 1, padding: '10px', background: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', cursor: 'pointer' }}>
                    <IconX size={16} /> Batalkan
                  </button>
                  <button onClick={() => handleAction(res.id, 'Sedang Makan')} style={{ flex: 2, padding: '10px', background: '#DBEAFE', color: '#1D4ED8', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', cursor: 'pointer' }}>
                    <IconCircleCheck size={16} /> Tamu Check-In
                  </button>
                </>
              )}

              {/* Sedang Makan: Selesai / Check-Out button */}
              {res.status === 'Sedang Makan' && (
                <button onClick={() => openCheckoutModal(res.id)} style={{ flex: 1, padding: '10px', background: '#DCFCE7', color: '#16A34A', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', cursor: 'pointer' }}>
                  <IconCircleCheck size={16} /> Tamu Selesai Makan (Check-Out)
                </button>
              )}
            </div>
          </div>
        ))}
        {reservations.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94A3B8' }}>
            <p>No reservations found.</p>
          </div>
        )}
      </div>
      </div>

      {/* Checkout Confirmation Modal */}
      {checkoutModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', width: '90%', maxWidth: '360px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', color: '#0F172A' }}>Konfirmasi Check-Out</h3>
            <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#64748B', lineHeight: '1.5' }}>
              Apakah Anda yakin tamu ini sudah selesai makan? Setelah dikonfirmasi, ketersediaan bangku akan otomatis bertambah kembali.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setCheckoutModalOpen(false)} style={{ flex: 1, padding: '12px', background: '#F1F5F9', color: '#64748B', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>Batal</button>
              <button onClick={handleCheckoutConfirm} style={{ flex: 1, padding: '12px', background: '#16A34A', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>Ya, Selesai</button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Confirmation Modal */}
      {approveModalOpen && selectedResForApprove && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', width: '90%', maxWidth: '400px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#0F172A' }}>Terima Reservasi</h3>
            
            {/* Show Area Occupancy if available */}
            {selectedResForApprove.area ? (
              <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '16px', marginBottom: '20px', border: '1px solid #E2E8F0' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#1E293B' }}>Status Area: {selectedResForApprove.area.name}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ background: 'white', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>Seato Terisi</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#0EA5A0' }}>{selectedResForApprove.area.seatoOccupied} <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 500 }}>/ {selectedResForApprove.area.seatoAllocated}</span></div>
                  </div>
                  <div style={{ background: 'white', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>Walk-in Terisi</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#F59E0B' }}>{selectedResForApprove.area.walkInOccupied}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px' }}>Data area tidak ditemukan.</div>
            )}

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1E293B', marginBottom: '8px' }}>Pilih Meja Tersedia *</label>
              
              {selectedResForApprove.area ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {getTableStatus(selectedResForApprove.area).map(t => (
                    <button
                      key={t.number}
                      type="button"
                      disabled={t.status !== 'available'}
                      onClick={() => setAssignedTable(`Meja ${t.number}`)}
                      style={{
                        width: '40px', height: '40px', borderRadius: '8px', border: 'none',
                        background: t.status === 'seato' ? '#0EA5A0' : t.status === 'walk-in' ? '#F59E0B' : (assignedTable === `Meja ${t.number}` ? '#1B3461' : '#F1F5F9'),
                        color: t.status !== 'available' || assignedTable === `Meja ${t.number}` ? 'white' : '#1E293B',
                        cursor: t.status === 'available' ? 'pointer' : 'not-allowed',
                        fontWeight: 600, fontSize: '14px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                    >
                      {t.number}
                    </button>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '13px', color: '#EF4444' }}>Data area tidak valid, tidak bisa memilih meja.</div>
              )}

              <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '16px', display: 'flex', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '12px', background: '#F1F5F9', borderRadius: '4px', border: '1px solid #E2E8F0' }}></div> Tersedia</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '12px', background: '#0EA5A0', borderRadius: '4px' }}></div> Seato</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '12px', background: '#F59E0B', borderRadius: '4px' }}></div> Walk-in</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setApproveModalOpen(false)} style={{ flex: 1, padding: '12px', background: '#F1F5F9', color: '#64748B', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>Batal</button>
              <button onClick={handleApproveConfirm} style={{ flex: 1, padding: '12px', background: '#16A34A', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>Approve & Assign</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
