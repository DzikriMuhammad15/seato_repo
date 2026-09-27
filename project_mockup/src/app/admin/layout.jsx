"use client";
import React from 'react';
import AdminSidebar from '../../components/layout/AdminSidebar';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>{children}</div>;
  }

  return (
    <div style={{ display: 'flex', width: '100vw', minHeight: '100vh', background: '#F8FAFC' }}>
      <AdminSidebar />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  );
}
