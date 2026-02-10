import { NextRequest } from 'next/server';

function sanitizeReferer(rawReferer: string): string {
  if (!rawReferer || rawReferer === '-') return '-';

  try {
    const url = new URL(rawReferer);
    return `${url.origin}${url.pathname}`;
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
