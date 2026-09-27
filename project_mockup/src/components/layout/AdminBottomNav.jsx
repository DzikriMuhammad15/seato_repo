"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminBottomNav() {
  const pathname = usePathname();

  // Do not show bottom nav on login page
  if (pathname === '/admin/login') return null;

  const tabs = [
    { id: 'dashboard', path: '/admin', icon: 'ti-dashboard' },
    { id: 'reservasi', path: '/admin/reservations', icon: 'ti-calendar-event' },
    { id: 'resto', path: '/admin/restaurants', icon: 'ti-building-store' },
    { id: 'promo', path: '/admin/promos', icon: 'ti-discount-2' }
  ];

  return (
    <div className="bottom-nav">
      {tabs.map((tab) => {
        const isActive = pathname === tab.path || (tab.path !== '/admin' && pathname.startsWith(tab.path));
        return (
          <Link href={tab.path} key={tab.id} style={{ textDecoration: 'none' }}>
            <div className={`nav-item ${isActive ? 'active' : ''}`} style={{ color: isActive ? '#0EA5A0' : '#94A3B8' }}>
              <i className={`ti ${tab.icon}`}></i>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
