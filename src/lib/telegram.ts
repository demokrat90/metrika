const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN?.trim();
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID?.trim();
const SITE_URL = 'https://promo.metrika.ae/arab';

function isTelegramConfigured(): boolean {
  return Boolean(TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID);
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

type LeadNotification = {
  source: 'quiz' | 'popup';
  fullName: string;
  phone: string;
  category?: string;
};

function formatMessage(lead: LeadNotification): string {
  const sourceLabel = lead.source === 'quiz' ? 'Квиз' : 'Попап';
  const lines = [
    `📥 <b>Новая заявка (${sourceLabel})</b>`,
    '',
    `Имя: ${escapeHtml(lead.fullName)}`,
    `Телефон: ${escapeHtml(lead.phone)}`,
  ];

  if (lead.source === 'popup' && lead.category) {
    lines.push(`Категория: ${escapeHtml(lead.category)}`);
  }

  lines.push(`🔗 ${SITE_URL}`);

  return lines.join('\n');
}

export async function notifyTelegram(lead: LeadNotification): Promise<void> {
  if (!isTelegramConfigured()) return;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: formatMessage(lead),
          parse_mode: 'HTML',
        }),
      }
    );

    if (!response.ok) {
      const body = await response.text();
      console.error(`Telegram API error (${response.status}): ${body}`);
    }
  } catch (error) {
    console.error('Telegram notification failed:', error);
  }
}
