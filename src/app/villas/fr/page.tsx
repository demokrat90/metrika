import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import VillasFrLanding from '@/components/VillasFrLanding';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Villas et maisons de ville à Dubaï',
  description: 'Villas et maisons de ville à Dubaï avec offres à jour et sélection personnalisée.',
};

export default function VillasFrPage() {
  return (
    <div className={montserrat.className}>
      <VillasFrLanding />
    </div>
  );
}
