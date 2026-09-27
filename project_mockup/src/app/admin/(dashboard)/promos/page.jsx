"use client";
import React, { useState, useEffect } from 'react';
import { IconPlus, IconEdit, IconTrash, IconX } from '@tabler/icons-react';

export default function AdminPromos() {
  const [promos, setPromos] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: '', title: '', subtitle: '', imageUrl: '', color: '#1B3461', type: 'GLOBAL', code: '', restaurantId: ''
  });

  useEffect(() => {
    fetchPromos();
    fetch('/api/restaurants')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setRestaurants(data); });
  }, []);

  const fetchPromos = () => {
    // If logged in as specific resto, filter promos (mockup logic)
    const restaurantId = localStorage.getItem('partnerRestoId');
    const url = restaurantId ? `/api/admin/promos?restaurantId=${restaurantId}` : '/api/admin/promos';
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setPromos(data);
      });
  };

  const openModal = (promo = null) => {
    if (promo) {
      setFormData({
        id: promo.id,
        title: promo.title,
        subtitle: promo.subtitle,
        imageUrl: promo.imageUrl || '',
        color: promo.color || '#1B3461',
        type: promo.type || 'GLOBAL',
        code: promo.code || '',
        restaurantId: promo.restaurantId || ''
      });
    } else {
      const restoId = localStorage.getItem('partnerRestoId') || '';
      setFormData({
        id: '', title: '', subtitle: '', imageUrl: '', color: '#1B3461', type: restoId ? 'COLLAB' : 'GLOBAL', code: '', restaurantId: restoId
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    const isEdit = !!formData.id;
    const url = isEdit ? `/api/admin/promos/${formData.id}` : '/api/admin/promos';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setIsModalOpen(false);
      fetchPromos();
    } catch (e) {
      console.error(e);
      alert('Gagal menyimpan promo');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus promo ini?')) return;
    try {
      await fetch(`/api/admin/promos/${id}`, { method: 'DELETE' });
      fetchPromos();
    } catch (e) {
      console.error(e);
      alert('Gagal menghapus promo');
    }
  };

  return (
    <div className="screen-content" style={{ background: '#F8FAFC' }}>
      <div style={{ background: 'white', padding: '64px 20px 24px', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 30 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Promos</h1>
          <button onClick={() => openModal()} style={{ width: '40px', height: '40px', background: '#0EA5A0', color: 'white', border: 'none', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <IconPlus size={20} />
          </button>
        </div>
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {promos.map((promo) => (
          <div key={promo.id} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #E2E8F0' }}>
            <div 
              style={{
                height: '140px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                color: 'white',
                background: promo.imageUrl 
                  ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${promo.imageUrl}) center/cover` 
                  : promo.color
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>{promo.title}</h2>
                  <p style={{ fontSize: '13px', opacity: 0.9 }}>{promo.subtitle}</p>
                </div>
                {promo.type === 'COLLAB' && (
                  <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold' }}>
                    COLLAB
                  </span>
                )}
              </div>
            </div>
            
            <div style={{ padding: '12px 16px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', fontSize: '13px', color: '#64748B' }}>
              <div><strong>Tipe:</strong> {promo.type}</div>
              {promo.type === 'COLLAB' && <div><strong>Kode:</strong> <span style={{color: '#0EA5A0', fontWeight: 700}}>{promo.code}</span></div>}
            </div>

            <div style={{ display: 'flex', gap: '8px', padding: '16px' }}>
              <button onClick={() => openModal(promo)} style={{ flex: 1, padding: '10px', background: '#F1F5F9', color: '#1B3461', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', cursor: 'pointer' }}>
                <IconEdit size={16} /> Edit
              </button>
              <button onClick={() => handleDelete(promo.id)} style={{ flex: 1, padding: '10px', background: '#FEE2E2', color: '#E11D48', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', cursor: 'pointer' }}>
                <IconTrash size={16} /> Delete
              </button>
            </div>
          </div>
        ))}

        {promos.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94A3B8' }}>
            <p>No promos available.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '400px', maxHeight: '90vh', overflowY: 'auto', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>{formData.id ? 'Edit Promo' : 'Tambah Promo'}</h2>
              <IconX onClick={() => setIsModalOpen(false)} style={{ cursor: 'pointer' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Tipe Promo</label>
                <select 
                  value={formData.type} 
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none' }}
                >
                  <option value="GLOBAL">Global Promo</option>
                  <option value="COLLAB">Kolaborasi Restoran</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Judul Promo</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Deskripsi / Subtitle</label>
                <input 
                  type="text" 
                  value={formData.subtitle} 
                  onChange={e => setFormData({...formData, subtitle: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none' }}
                />
              </div>

              {formData.type === 'COLLAB' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Kode Promo</label>
                    <input 
                      type="text" 
                      value={formData.code} 
                      onChange={e => setFormData({...formData, code: e.target.value})}
                      placeholder="e.g. SEATO10"
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Restoran</label>
                    <select 
                      value={formData.restaurantId} 
                      onChange={e => setFormData({...formData, restaurantId: e.target.value})}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none' }}
                    >
                      <option value="">-- Pilih Restoran --</option>
                      {restaurants.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <button 
                onClick={handleSave} 
                style={{ width: '100%', padding: '16px', background: '#0EA5A0', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, marginTop: '8px', cursor: 'pointer' }}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
