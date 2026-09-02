import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar, Footer } from '../components/layout';
import { usePageMetadata } from '../hooks/usePageMetadata';

export const MainLayout = () => {
  usePageMetadata();

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-brand-500 selection:text-white">
      {/* Skip link for keyboard accessibility */}
      <a
        href="#main-content"
        className="skip-link"
      >
        Skip to main content
      </a>

      {/* Global Responsive Navigation Header */}
      <Navbar />

      {/* Main Content Landmark */}
      <main id="main-content" className="flex-grow flex flex-col focus:outline-none" tabIndex={-1}>
        <Outlet />
      </main>

      {/* Global Footer Landmark */}
      <Footer />
    </div>
  );
};

export default MainLayout;
