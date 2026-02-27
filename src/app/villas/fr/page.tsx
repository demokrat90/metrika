import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import VillasFrLanding from '@/components/VillasFrLanding';

const villasFont = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--vf-font-body',
});

export const metadata: Metadata = {
  title: 'Villas et maisons de ville à Dubaï',
  description: 'Villas et maisons de ville à Dubaï avec offres à jour et sélection personnalisée.',
};

export default function VillasFrPage() {
  return (
    <div className={villasFont.variable}>
      <VillasFrLanding />
    </div>
  );
}
