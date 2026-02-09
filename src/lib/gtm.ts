declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag: (...args: unknown[]) => void;
  }
}

export function pushEvent(event: string, data?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...data });
}

export function trackConversion() {
  if (typeof window === 'undefined' || !window.gtag) return;
  const adsId = process.env.NEXT_PUBLIC_ADS_ID;
  const adsLabel = process.env.NEXT_PUBLIC_ADS_LABEL;
  if (!adsId || !adsLabel) return;
  window.gtag('event', 'conversion', {
    send_to: `${adsId}/${adsLabel}`,
  });
}
