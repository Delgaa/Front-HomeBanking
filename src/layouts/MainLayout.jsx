import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-surface-muted">
      <Header isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      <div className="flex-1 flex flex-col w-full transition-all duration-300">
        <main className="grow p-4 md:p-8 overflow-y-auto">
           {isMobileMenuOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-20 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default MainLayout