import type { Metadata } from 'next';
import VillasFrLanding from '@/components/VillasFrLanding';

export const metadata: Metadata = {
  title: 'Villas et maisons de ville à Dubaï',
  description: 'Villas et maisons de ville à Dubaï avec offres à jour et sélection personnalisée.',
};

export default function VillasFrPage() {
  return <VillasFrLanding />;
}
