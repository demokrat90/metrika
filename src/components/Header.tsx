'use client';
import Image from 'next/image';

interface HeaderProps {
  onMenuToggle?: (isOpen: boolean) => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="Metrika"
              width={190}
              height={64}
              className="h-12 md:h-14 w-auto"
              priority
            />
          </a>
        </div>
      </header>
    </>
  );
}
