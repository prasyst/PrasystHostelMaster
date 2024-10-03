import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarDrawar from './SidebarDrawar';

function DashboardLayout() {
  return (
    <div style={{ display: 'flex' }}>
      <SidebarDrawar />
      <main style={{ flexGrow: 1, padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;