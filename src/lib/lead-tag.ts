import { NextRequest } from 'next/server';

type ResolveLeadTagInput = {
  request: NextRequest;
  landing?: string;
  source?: string;
  category?: string;
};

export function resolveLeadTag({ request, landing, source, category }: ResolveLeadTagInput): 'France' | 'Arab' {
  const normalizedLanding = (landing || '').trim().toLowerCase();
  const normalizedSource = (source || '').trim().toLowerCase();
  const normalizedCategory = (category || '').trim().toLowerCase();
  const referer = request.headers.get('referer') || '';

  let refererPath = '';
  try {
    refererPath = new URL(referer).pathname.toLowerCase();
  } catch {
    refererPath = '';
  }

  const isFranceLead =
    normalizedLanding === 'fr' ||
    normalizedLanding === 'france' ||
    normalizedSource.includes('villas-fr') ||
    normalizedCategory.includes('villas fr') ||
    refererPath.includes('/villas/fr');

  if (isFranceLead) {
    return 'France';
  }

  const isArabLead =
    normalizedLanding === 'arab' ||
    normalizedSource.includes('arab') ||
    refererPath.includes('/arab');

  if (isArabLead) {
    return 'Arab';
  }

  return 'Arab';
}
