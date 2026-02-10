import { NextRequest } from 'next/server';

export type RequestTrackingKey =
  | 'utm_content'
  | 'utm_medium'
  | 'utm_campaign'
  | 'utm_source'
  | 'utm_term'
  | 'utm_referrer'
  | 'roistat'
  | 'referrer'
  | 'openstat_service'
  | 'openstat_campaign'
  | 'openstat_ad'
  | 'openstat_source'
  | 'from'
  | 'gclientid'
  | '_ym_uid'
  | '_ym_counter'
  | 'yclid'
  | 'gclid'
  | 'fbclid';
export type RequestTrackingData = Partial<Record<RequestTrackingKey, string>>;
type RequestTrackingOptions = {
  rawCookieHeader?: string;
};

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

function sanitizeTrackingValue(value?: string | null): string | undefined {
  if (!value) return undefined;
  const normalized = value.trim();
  if (!normalized || normalized === '-') return undefined;
  return normalized;
}

function firstNonEmpty(...values: Array<string | undefined>): string | undefined {
  return values.find((item) => Boolean(item));
}

function parseCookieHeader(rawCookieHeader?: string): Record<string, string> {
  if (!rawCookieHeader) return {};

  return rawCookieHeader
    .split(';')
    .map((item) => item.trim())
    .filter(Boolean)
    .reduce<Record<string, string>>((acc, item) => {
      const separatorIndex = item.indexOf('=');
      if (separatorIndex === -1) return acc;

      const key = item.slice(0, separatorIndex).trim();
      const value = item.slice(separatorIndex + 1).trim();
      if (!key) return acc;

      try {
        acc[key] = decodeURIComponent(value);
      } catch {
        acc[key] = value;
      }

      return acc;
    }, {});
}

function parseUrl(value: string): URL | null {
  if (!value || value === '-') return null;
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

function decodeBase64(value: string): string | undefined {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');

  try {
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return undefined;
  }
}

function parseOpenstat(raw?: string): Pick<RequestTrackingData, 'openstat_service' | 'openstat_campaign' | 'openstat_ad' | 'openstat_source'> {
  if (!raw) {
    return {};
  }

  const decodedUri = (() => {
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  })();

  const normalized = decodedUri.includes(';')
    ? decodedUri
    : decodeBase64(decodedUri) || decodedUri;

  const [service, campaign, ad, source] = normalized.split(';');
  return {
    openstat_service: sanitizeTrackingValue(service),
    openstat_campaign: sanitizeTrackingValue(campaign),
    openstat_ad: sanitizeTrackingValue(ad),
    openstat_source: sanitizeTrackingValue(source),
  };
}

function parseGaClientId(raw?: string): string | undefined {
  if (!raw) return undefined;
  const chunks = raw.split('.');
  if (chunks.length < 4) return undefined;
  const partA = sanitizeTrackingValue(chunks[chunks.length - 2]);
  const partB = sanitizeTrackingValue(chunks[chunks.length - 1]);
  if (!partA || !partB) return undefined;
  return `${partA}.${partB}`;
}

function parseGclidFromGclCookie(raw?: string): string | undefined {
  if (!raw) return undefined;
  const chunks = raw.split('.');
  return sanitizeTrackingValue(chunks[chunks.length - 1]);
}

function parseFbclidFromFbcCookie(raw?: string): string | undefined {
  if (!raw) return undefined;
  const chunks = raw.split('.');
  return sanitizeTrackingValue(chunks[chunks.length - 1]);
}

export function extractRequestTracking(
  request: NextRequest,
  options?: RequestTrackingOptions
): RequestTrackingData {
  const refererHeader = request.headers.get('referer') || '';
  const refererUrl = parseUrl(refererHeader);
  const cookieHeader = options?.rawCookieHeader || request.headers.get('cookie') || '';
  const parsedCookieHeader = parseCookieHeader(cookieHeader);

  const fromQuery = (param: string): string | undefined =>
    sanitizeTrackingValue(refererUrl?.searchParams.get(param));

  const fromCookie = (cookieName: string): string | undefined =>
    sanitizeTrackingValue(
      request.cookies.get(cookieName)?.value ||
      parsedCookieHeader[cookieName]
    );

  const openstatFromParam = parseOpenstat(fromQuery('openstat'));
  const openstatFromCookie = parseOpenstat(fromCookie('_openstat') || fromCookie('openstat'));

  return {
    utm_content: firstNonEmpty(fromQuery('utm_content'), fromCookie('utm_content')),
    utm_medium: firstNonEmpty(fromQuery('utm_medium'), fromCookie('utm_medium')),
    utm_campaign: firstNonEmpty(fromQuery('utm_campaign'), fromCookie('utm_campaign')),
    utm_source: firstNonEmpty(fromQuery('utm_source'), fromCookie('utm_source')),
    utm_term: firstNonEmpty(fromQuery('utm_term'), fromCookie('utm_term')),
    utm_referrer: firstNonEmpty(fromQuery('utm_referrer'), fromCookie('utm_referrer')),
    roistat: firstNonEmpty(fromQuery('roistat'), fromCookie('roistat_visit'), fromCookie('roistat')),
    referrer: firstNonEmpty(fromQuery('referrer'), fromCookie('referrer'), sanitizeTrackingValue(sanitizeReferer(refererHeader))),
    openstat_service: firstNonEmpty(fromQuery('openstat_service'), fromCookie('openstat_service'), openstatFromParam.openstat_service, openstatFromCookie.openstat_service),
    openstat_campaign: firstNonEmpty(fromQuery('openstat_campaign'), fromCookie('openstat_campaign'), openstatFromParam.openstat_campaign, openstatFromCookie.openstat_campaign),
    openstat_ad: firstNonEmpty(fromQuery('openstat_ad'), fromCookie('openstat_ad'), openstatFromParam.openstat_ad, openstatFromCookie.openstat_ad),
    openstat_source: firstNonEmpty(fromQuery('openstat_source'), fromCookie('openstat_source'), openstatFromParam.openstat_source, openstatFromCookie.openstat_source),
    from: firstNonEmpty(fromQuery('from'), fromCookie('from')),
    gclientid: firstNonEmpty(
      fromQuery('gclientid'),
      fromCookie('gclientid'),
      parseGaClientId(fromCookie('_ga'))
    ),
    _ym_uid: firstNonEmpty(fromQuery('_ym_uid'), fromCookie('_ym_uid')),
    _ym_counter: firstNonEmpty(fromQuery('_ym_counter'), fromCookie('_ym_counter')),
    yclid: firstNonEmpty(fromQuery('yclid'), fromCookie('yclid')),
    gclid: firstNonEmpty(
      fromQuery('gclid'),
      fromCookie('gclid'),
      parseGclidFromGclCookie(fromCookie('_gcl_aw')),
      parseGclidFromGclCookie(fromCookie('_gcl_dc'))
    ),
    fbclid: firstNonEmpty(
      fromQuery('fbclid'),
      fromCookie('fbclid'),
      parseFbclidFromFbcCookie(fromCookie('_fbc'))
    ),
  };
}

export function buildRequestContextNote(request: NextRequest): string {
  const referer = sanitizeReferer(request.headers.get('referer') || '-');

  return [
    'Request context:',
    `Referer: ${referer}`,
  ].join('\n');
}
