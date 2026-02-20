'use client';
import Image from 'next/image';

interface HeaderProps {
  onMenuToggle?: (isOpen: boolean) => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  return (
    <>
      <header className="absolute top-4 md:top-6 inset-x-0 z-50 bg-transparent">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-8 flex items-center justify-end">
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
