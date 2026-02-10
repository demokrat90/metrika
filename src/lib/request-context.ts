import { NextRequest } from 'next/server';

function sanitizeReferer(rawReferer: string): string {
  if (!rawReferer || rawReferer === '-') return '-';

  const trimmed = rawReferer.trim();
  const withoutFragment = trimmed.split('#', 1)[0] || trimmed;
  const withoutQuery = withoutFragment.split('?', 1)[0] || withoutFragment;

  try {
    const url = new URL(withoutQuery);
    return `${url.origin}${url.pathname}`;
  } catch {
    return withoutQuery;
  }
}

export function buildRequestContextNote(request: NextRequest): string {
  const referer = sanitizeReferer(request.headers.get('referer') || '-');

  return [
    'Request context:',
    `Referer: ${referer}`,
  ].join('\n');
}
