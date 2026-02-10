import { NextRequest } from 'next/server';

const MAX_COOKIE_VALUE_LENGTH = 180;

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}...`;
}

export function buildRequestContextNote(request: NextRequest): string {
  const referer = request.headers.get('referer') || '-';
  const userAgent = request.headers.get('user-agent') || '-';
  const forwardedFor = request.headers.get('x-forwarded-for') || '-';
  const realIp = request.headers.get('x-real-ip') || '-';

  const cookies = request.cookies.getAll();
  const cookiesBlock = cookies.length > 0
    ? cookies
      .map((cookie) => `${cookie.name}=${truncate(cookie.value, MAX_COOKIE_VALUE_LENGTH)}`)
      .join('\n')
    : '-';

  return [
    'Request context:',
    `Referer: ${referer}`,
    `User-Agent: ${userAgent}`,
    `X-Forwarded-For: ${forwardedFor}`,
    `X-Real-IP: ${realIp}`,
    'Cookies:',
    cookiesBlock,
  ].join('\n');
}
