import { NextRequest } from 'next/server';

function sanitizeReferer(rawReferer: string): string {
  if (!rawReferer || rawReferer === '-') return '-';

  try {
    const url = new URL(rawReferer);
    const keys = Array.from(url.searchParams.keys());

    for (const key of keys) {
      if (key.toLowerCase().startsWith('utm_')) {
        url.searchParams.delete(key);
      }
    }

    return url.toString();
  } catch {
    return rawReferer;
  }
}

export function buildRequestContextNote(request: NextRequest): string {
  const referer = sanitizeReferer(request.headers.get('referer') || '-');

  return [
    'Request context:',
    `Referer: ${referer}`,
  ].join('\n');
}
