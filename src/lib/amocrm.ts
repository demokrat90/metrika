const AMOCRM_SUBDOMAIN = process.env.AMOCRM_SUBDOMAIN?.trim();
const AMOCRM_BASE_URL = process.env.AMOCRM_BASE_URL?.trim();
const AMOCRM_ACCESS_TOKEN = process.env.AMOCRM_ACCESS_TOKEN?.trim();
const AMOCRM_PIPELINE_ID = process.env.AMOCRM_PIPELINE_ID?.trim();
const AMOCRM_STATUS_ID = process.env.AMOCRM_STATUS_ID?.trim();
const AMOCRM_PIPELINE_NAME = process.env.AMOCRM_PIPELINE_NAME?.trim() || 'Administrators';
const AMOCRM_STATUS_NAME = process.env.AMOCRM_STATUS_NAME?.trim() || 'Incoming';

type AmoLeadContactValue = {
  value: string;
  enum_code?: string;
};

type AmoCustomFieldByName = {
  field_name: string;
  values: AmoLeadContactValue[];
};

type AmoCustomFieldByCode = {
  field_code: string;
  values: AmoLeadContactValue[];
};

export type AmoCustomField = AmoCustomFieldByName | AmoCustomFieldByCode;

type AmoLeadPayload = {
  leadName: string;
  leadFields?: AmoCustomField[];
  contact: {
    fullName?: string;
    phone?: string;
    email?: string;
    extraFields?: AmoCustomField[];
  };
};

function normalizeAmoBaseUrl(): string | null {
  const raw = AMOCRM_BASE_URL || AMOCRM_SUBDOMAIN;
  if (!raw) return null;

  const normalized = raw
    .replace(/^https?:\/\//i, '')
    .replace(/\/+$/, '');

  // Supports both:
  // - company (will become company.amocrm.ru)
  // - company.amocrm.ru / company.kommo.com
  const host = normalized.includes('.') ? normalized : `${normalized}.amocrm.ru`;
  return `https://${host}`;
}

function getPipelineId(): number | undefined {
  if (!AMOCRM_PIPELINE_ID) return undefined;
  const pipelineId = Number(AMOCRM_PIPELINE_ID);
  return Number.isFinite(pipelineId) ? pipelineId : undefined;
}

function getStatusId(): number | undefined {
  if (!AMOCRM_STATUS_ID) return undefined;
  const statusId = Number(AMOCRM_STATUS_ID);
  return Number.isFinite(statusId) ? statusId : undefined;
}

export function isAmoConfigured(): boolean {
  return Boolean(normalizeAmoBaseUrl() && AMOCRM_ACCESS_TOKEN);
}

function normalizeName(value?: string): string {
  return (value || '').trim().toLowerCase();
}

async function fetchAmo<T>(baseUrl: string, path: string): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      Authorization: `Bearer ${AMOCRM_ACCESS_TOKEN}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`AmoCRM API error (${response.status}) on ${path}: ${body}`);
  }

  return response.json() as Promise<T>;
}

async function resolvePipelineAndStatusIds(baseUrl: string): Promise<{ pipelineId: number; statusId: number }> {
  const pipelineIdFromEnv = getPipelineId();
  const statusIdFromEnv = getStatusId();

  if (pipelineIdFromEnv && statusIdFromEnv) {
    return { pipelineId: pipelineIdFromEnv, statusId: statusIdFromEnv };
  }

  const pipelinesData = await fetchAmo<{
    _embedded?: { pipelines?: Array<{ id: number; name: string }> };
  }>(baseUrl, '/api/v4/leads/pipelines');

  const pipelines = pipelinesData?._embedded?.pipelines || [];
  const pipeline = pipelineIdFromEnv
    ? pipelines.find((item) => item.id === pipelineIdFromEnv)
    : pipelines.find((item) => normalizeName(item.name) === normalizeName(AMOCRM_PIPELINE_NAME));

  if (!pipeline) {
    throw new Error(`AmoCRM pipeline not found: "${AMOCRM_PIPELINE_NAME}"`);
  }

  const statusesData = await fetchAmo<{
    _embedded?: { statuses?: Array<{ id: number; name: string }> };
  }>(baseUrl, `/api/v4/leads/pipelines/${pipeline.id}/statuses`);

  const statuses = statusesData?._embedded?.statuses || [];
  const status = statusIdFromEnv
    ? statuses.find((item) => item.id === statusIdFromEnv)
    : statuses.find((item) => normalizeName(item.name) === normalizeName(AMOCRM_STATUS_NAME));

  if (!status) {
    throw new Error(`AmoCRM status not found: "${AMOCRM_STATUS_NAME}" in pipeline "${pipeline.name}"`);
  }

  return { pipelineId: pipeline.id, statusId: status.id };
}

function splitFullName(fullName?: string): { firstName: string; lastName: string } {
  const normalized = (fullName || '').trim();
  if (!normalized) {
    return { firstName: 'Unknown', lastName: '' };
  }

  const chunks = normalized.split(/\s+/);
  return {
    firstName: chunks[0] || 'Unknown',
    lastName: chunks.slice(1).join(' '),
  };
}

export async function submitAmoLead(payload: AmoLeadPayload): Promise<void> {
  const baseUrl = normalizeAmoBaseUrl();
  if (!baseUrl || !AMOCRM_ACCESS_TOKEN) {
    throw new Error('AmoCRM is not configured. Check AMOCRM_BASE_URL/AMOCRM_SUBDOMAIN and AMOCRM_ACCESS_TOKEN.');
  }

  const { pipelineId, statusId } = await resolvePipelineAndStatusIds(baseUrl);
  const nameParts = splitFullName(payload.contact.fullName);

  const contactFields: AmoCustomField[] = [
    ...(payload.contact.phone
      ? [{
          field_code: 'PHONE',
          values: [{ value: payload.contact.phone, enum_code: 'MOB' }],
        } satisfies AmoCustomField]
      : []),
    ...(payload.contact.email
      ? [{
          field_code: 'EMAIL',
          values: [{ value: payload.contact.email, enum_code: 'WORK' }],
        } satisfies AmoCustomField]
      : []),
    ...(payload.contact.extraFields || []),
  ];

  const response = await fetch(`${baseUrl}/api/v4/leads/complex`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${AMOCRM_ACCESS_TOKEN}`,
    },
    body: JSON.stringify([
      {
        name: payload.leadName,
        pipeline_id: pipelineId,
        status_id: statusId,
        custom_fields_values: payload.leadFields || [],
        _embedded: {
          contacts: [
            {
              name: payload.contact.fullName || 'Unknown',
              first_name: nameParts.firstName,
              last_name: nameParts.lastName,
              custom_fields_values: contactFields,
            },
          ],
        },
      },
    ]),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`AmoCRM API error (${response.status}): ${body}`);
  }
}
