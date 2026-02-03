'use client';

import { useState } from 'react';
import Image from 'next/image';

interface HeaderProps {
  onMenuToggle?: (isOpen: boolean) => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    const newState = !isMenuOpen;
    setIsMenuOpen(newState);
    onMenuToggle?.(newState);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="Metrika"
              width={150}
              height={50}
              className="h-10 w-auto"
              priority
            />
          </a>

          {/* Hamburger Menu Button */}
          <button
            onClick={toggleMenu}
            className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 z-50 relative"
            aria-label="Toggle menu"
          >
            <span
              className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                isMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                isMenuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                isMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-[#171717] transition-transform duration-300 ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="container mx-auto px-4 pt-24">
          <nav className="flex flex-col gap-6">
            <a
              href="#quiz"
              className="text-2xl text-white hover:text-[#a39466] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              اختيار العقارات
            </a>
          </nav>

          {/* Developer Dropdown */}
          <div className="mt-12">
            <h3 className="text-[#a39466] text-lg mb-4">المطورين</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                'إعمار',
                'داماك',
                'مراس',
                'نخيل',
                'سوبها',
                'ديار',
              ].map((developer) => (
                <a
                  key={developer}
                  href="#"
                  className="text-white hover:text-[#a39466] transition-colors"
                >
                  {developer}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-12 border-t border-[#333] pt-8">
            <a
              href="tel:+97144567890"
              className="text-xl text-white hover:text-[#a39466] transition-colors"
            >
              +971 4 456 7890
            </a>
            <p className="text-[#c9c9c9] mt-4">
              دبي، الإمارات العربية المتحدة
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
