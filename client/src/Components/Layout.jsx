import { Menu, X } from 'lucide-react';
import Navbar from './Navbar';
import React, { useState } from 'react';

export default function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen h-screen relative bg-gray-100">
      {/* Toggle Button (Mobile Only) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded shadow"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar/Navbar */}
      <div
        className={`${
          isOpen ? 'block' : 'hidden'
        } fixed top-0 left-0 h-full z-40 shadow-md
          md:block md:static md:h-auto 
        `}
      >
        <Navbar toggleNavbar={() => setIsOpen(false)} isOpen={isOpen} />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto md:ml-0 p-4">
        {children}
      </div>
    </div>
  );
}
