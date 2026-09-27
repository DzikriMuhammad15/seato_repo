import React, { useState, useEffect, useMemo } from 'react';
import RestaurantCard from '../components/ui/RestaurantCard';

export default function ExploreScreen({ onSelectRestaurant }) {
  const [exploreLoc, setExploreLoc] = useState('Bandung');
  const [exploreFilters, setExploreFilters] = useState(['Semua']);
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetch('/api/restaurants')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setRestaurants(data); });
  }, []);

  const filterOptions = ['Semua', 'Cafe', 'Restoran', 'Fine Dining', 'Rooftop', 'Buka 24 Jam', 'Rating 4.5+'];

  const handleFilterToggle = (filter) => {
    if (filter === 'Semua') {
      setExploreFilters(['Semua']);
      return;
    }
    let newFilters = exploreFilters.filter(f => f !== 'Semua');
    if (newFilters.includes(filter)) {
      newFilters = newFilters.filter(f => f !== filter);
      if (newFilters.length === 0) newFilters = ['Semua'];
    } else {
      newFilters.push(filter);
    }
    setExploreFilters(newFilters);
  };

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter(item => {
      // 1. Filter by location
      if (!item.city.includes(exploreLoc)) return false;

      // 2. Filter by search query
      if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // 3. Filter by selected chips (AND logic for stricter filtering)
      if (!exploreFilters.includes('Semua')) {
        for (const filter of exploreFilters) {
          if (filter === 'Rating 4.5+' && item.rating < 4.5) return false;
          if (filter === 'Buka 24 Jam' && !item.tags.includes('Buka 24 Jam')) return false;
          
          // Category matching
          const categoryFilters = ['Cafe', 'Restoran', 'Fine Dining', 'Rooftop'];
          if (categoryFilters.includes(filter)) {
            if (!item.tags.includes(filter) && !item.type.includes(filter)) return false;
          }
        }
      }

      return true;
    });
  }, [exploreLoc, exploreFilters, searchQuery, restaurants]);

  return (
    <div className="screen-content">
      <div className="explore-header">
        <h1 className="text-navy">Explore</h1>
        <div className="search-bar" style={{ border: '0.5px solid #E2E8F0' }}>
          <i className="ti ti-search text-muted"></i>
          <input 
            type="text" 
            placeholder="Cari restoran, cafe..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="location-toggle">
          <div className={`loc-btn ${exploreLoc === 'Bandung' ? 'active' : ''}`} onClick={() => setExploreLoc('Bandung')}>Bandung</div>
          <div className={`loc-btn ${exploreLoc === 'Jakarta' ? 'active' : ''}`} onClick={() => setExploreLoc('Jakarta')}>Jakarta</div>
        </div>
      </div>

      <div style={{ padding: '16px 0' }}>
        <div className="horizontal-scroll">
          {filterOptions.map(f => (
            <div 
              key={f} 
              className={`filter-chip ${exploreFilters.includes(f) ? 'active' : ''}`}
              onClick={() => handleFilterToggle(f)}
            >
              {f}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-row justify-between" style={{ padding: '0 20px 16px' }}>
        <span className="text-muted" style={{ fontWeight: 600 }}>{filteredRestaurants.length} Restoran ditemukan</span>
        <span className="text-navy flex-row gap-2" style={{ fontWeight: 600, cursor: 'pointer' }}>Urutkan: Relevan <i className="ti ti-chevron-down"></i></span>
      </div>

      <div className="flex-col gap-4" style={{ padding: '0 20px' }}>
        {filteredRestaurants.map(item => (
          <RestaurantCard 
            key={item.id} 
            data={item} 
            variant="explore" 
            onAction={onSelectRestaurant} 
          />
        ))}
        {filteredRestaurants.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748B' }}>
            <i className="ti ti-search" style={{ fontSize: '48px', opacity: 0.5, marginBottom: '16px' }}></i>
            <p>Tidak ada restoran yang cocok dengan filter atau pencarian Anda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
