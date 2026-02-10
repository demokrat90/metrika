import { type RequestTrackingData, type RequestTrackingKey } from '@/lib/request-context';

const AMOCRM_SUBDOMAIN = process.env.AMOCRM_SUBDOMAIN?.trim();
const AMOCRM_BASE_URL = process.env.AMOCRM_BASE_URL?.trim();
const AMOCRM_ACCESS_TOKEN = process.env.AMOCRM_ACCESS_TOKEN?.trim();
const AMOCRM_PIPELINE_ID = process.env.AMOCRM_PIPELINE_ID?.trim();
const AMOCRM_STATUS_ID = process.env.AMOCRM_STATUS_ID?.trim();
const AMOCRM_PIPELINE_NAME = process.env.AMOCRM_PIPELINE_NAME?.trim() || 'Administrators';
const AMOCRM_STATUS_NAME = process.env.AMOCRM_STATUS_NAME?.trim() || 'Incoming';
const AMOCRM_MAX_NOTE_LENGTH = 12000;
const AMOCRM_CUSTOM_FIELDS_CACHE_TTL_MS = 5 * 60 * 1000;
const AMOCRM_COOKIES_MAX_LENGTH = 3500;

type AmoLeadContactValue = {
  value: string;
  enum_code?: string;
};

type AmoCustomFieldByCode = {
  field_code: string;
  values: AmoLeadContactValue[];
};

type AmoCustomFieldById = {
  field_id: number;
  values: AmoLeadContactValue[];
};

export type AmoCustomField = AmoCustomFieldByCode | AmoCustomFieldById;

type AmoTag = {
  name: string;
};

type AmoLeadPayload = {
  leadName: string;
  tags?: string[];
  noteText?: string;
  tracking?: RequestTrackingData;
  contact: {
    fullName?: string;
    phone?: string;
    email?: string;
  };
};

type AmoLeadCustomFieldDefinition = {
  id: number;
  code?: string | null;
  name: string;
};

type TrackingFieldMatcher = {
  codes: string[];
  names: string[];
};

const TRACKING_FIELD_MATCHERS: Record<RequestTrackingKey, TrackingFieldMatcher> = {
  utm_content: {
    codes: ['UTM_CONTENT'],
    names: ['utm_content', 'utm content'],
  },
  utm_medium: {
    codes: ['UTM_MEDIUM'],
    names: ['utm_medium', 'utm medium'],
  },
  utm_campaign: {
    codes: ['UTM_CAMPAIGN'],
    names: ['utm_campaign', 'utm campaign'],
  },
  utm_source: {
    codes: ['UTM_SOURCE'],
    names: ['utm_source', 'utm source'],
  },
  utm_term: {
    codes: ['UTM_TERM'],
    names: ['utm_term', 'utm term'],
  },
  utm_referrer: {
    codes: ['UTM_REFERRER'],
    names: ['utm_referrer', 'utm referrer'],
  },
  roistat: {
    codes: ['ROISTAT'],
    names: ['roistat'],
  },
  referrer: {
    codes: ['REFERRER'],
    names: ['referrer'],
  },
  openstat_service: {
    codes: ['OPENSTAT_SERVICE'],
    names: ['openstat_service', 'openstat service'],
  },
  openstat_campaign: {
    codes: ['OPENSTAT_CAMPAIGN'],
    names: ['openstat_campaign', 'openstat campaign'],
  },
  openstat_ad: {
    codes: ['OPENSTAT_AD'],
    names: ['openstat_ad', 'openstat ad'],
  },
  openstat_source: {
    codes: ['OPENSTAT_SOURCE'],
    names: ['openstat_source', 'openstat source'],
  },
  from: {
    codes: ['FROM'],
    names: ['from'],
  },
  gclientid: {
    codes: ['GCLIENTID', 'CLIENT_ID'],
    names: ['gclientid', 'clientid', 'client_id', 'google client id'],
  },
  _ym_uid: {
    codes: ['YM_UID'],
    names: ['_ym_uid', 'ym_uid'],
  },
  _ym_counter: {
    codes: ['YM_COUNTER'],
    names: ['_ym_counter', 'ym_counter'],
  },
  yclid: {
    codes: ['YCLID'],
    names: ['yclid'],
  },
  gclid: {
    codes: ['GCLID'],
    names: ['gclid'],
  },
  fbclid: {
    codes: ['FBCLID'],
    names: ['fbclid'],
  },
  cookies: {
    codes: ['COOKIES'],
    names: ['cookies'],
  },
};

let leadCustomFieldsCache:
  | {
      baseUrl: string;
      expiresAt: number;
      fields: AmoLeadCustomFieldDefinition[];
    }
  | undefined;

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

function normalizeFieldIdentifier(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, '_');
}

function sanitizeTrackingValue(value?: string): string | undefined {
  if (!value) return undefined;
  const normalized = value.trim();
  if (!normalized || normalized === '-') return undefined;
  return normalized;
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

async function fetchAllLeadCustomFields(baseUrl: string): Promise<AmoLeadCustomFieldDefinition[]> {
  const pageSize = 250;
  const customFields: AmoLeadCustomFieldDefinition[] = [];
  let page = 1;

  while (true) {
    const response = await fetchAmo<{
      _embedded?: {
        custom_fields?: AmoLeadCustomFieldDefinition[];
      };
    }>(baseUrl, `/api/v4/leads/custom_fields?limit=${pageSize}&page=${page}`);

    const currentPage = response._embedded?.custom_fields || [];
    customFields.push(...currentPage);

    if (currentPage.length < pageSize) {
      break;
    }

    page += 1;
  }

  return customFields;
}

async function getLeadCustomFields(baseUrl: string): Promise<AmoLeadCustomFieldDefinition[]> {
  const now = Date.now();
  if (
    leadCustomFieldsCache &&
    leadCustomFieldsCache.baseUrl === baseUrl &&
    leadCustomFieldsCache.expiresAt > now
  ) {
    return leadCustomFieldsCache.fields;
  }

  const fields = await fetchAllLeadCustomFields(baseUrl);
  leadCustomFieldsCache = {
    baseUrl,
    fields,
    expiresAt: now + AMOCRM_CUSTOM_FIELDS_CACHE_TTL_MS,
  };

  return fields;
}

function resolveTrackingFieldId(
  fields: AmoLeadCustomFieldDefinition[],
  matcher: TrackingFieldMatcher
): number | undefined {
  for (const code of matcher.codes) {
    const byCode = fields.find((field) => normalizeName(field.code || '') === normalizeName(code));
    if (byCode) {
      return byCode.id;
    }
  }

  for (const name of matcher.names) {
    const normalized = normalizeFieldIdentifier(name);
    const byName = fields.find((field) => normalizeFieldIdentifier(field.name) === normalized);
    if (byName) {
      return byName.id;
    }
  }

  return undefined;
}

async function buildLeadTrackingCustomFields(
  baseUrl: string,
  tracking?: RequestTrackingData
): Promise<AmoCustomField[]> {
  if (!tracking) {
    return [];
  }

  const trackingEntries = Object.entries(tracking)
    .map(([key, value]) => [key as RequestTrackingKey, sanitizeTrackingValue(value)] as const)
    .filter((entry): entry is readonly [RequestTrackingKey, string] => Boolean(entry[1]));

  if (trackingEntries.length === 0) {
    return [];
  }

  const leadFields = await getLeadCustomFields(baseUrl);
  const usedFieldIds = new Set<number>();
  const result: AmoCustomField[] = [];

  for (const [trackingKey, trackingValue] of trackingEntries) {
    const matcher = TRACKING_FIELD_MATCHERS[trackingKey];
    if (!matcher) {
      continue;
    }

    const fieldId = resolveTrackingFieldId(leadFields, matcher);
    if (!fieldId || usedFieldIds.has(fieldId)) {
      continue;
    }

    const valueToSend = trackingKey === 'cookies'
      ? trackingValue.slice(0, AMOCRM_COOKIES_MAX_LENGTH)
      : trackingValue;

    result.push({
      field_id: fieldId,
      values: [{ value: valueToSend }],
    });
    usedFieldIds.add(fieldId);
  }

  return result;
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

function toAmoTags(tags: string[] | undefined): AmoTag[] {
  if (!tags) return [];
  const unique = Array.from(new Set(tags.map((item) => item.trim()).filter(Boolean)));
  return unique.map((name) => ({ name }));
}

async function addLeadNote(baseUrl: string, leadId: number, noteText: string): Promise<void> {
  const normalizedText = noteText.trim();
  const text = normalizedText.length <= AMOCRM_MAX_NOTE_LENGTH
    ? normalizedText
    : `${normalizedText.slice(0, AMOCRM_MAX_NOTE_LENGTH)}\n...[truncated]`;
  if (!text) return;

  const response = await fetch(`${baseUrl}/api/v4/leads/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${AMOCRM_ACCESS_TOKEN}`,
    },
    body: JSON.stringify([
      {
        entity_id: leadId,
        note_type: 'common',
        params: { text },
      },
    ]),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`AmoCRM notes API error (${response.status}): ${body}`);
  }
}

function extractLeadId(payload: unknown): number | undefined {
  if (Array.isArray(payload)) {
    const firstWithId = payload.find(
      (item) => typeof item === 'object' && item !== null && typeof (item as { id?: unknown }).id === 'number'
    ) as { id: number } | undefined;
    return firstWithId?.id;
  }

  if (!payload || typeof payload !== 'object') {
    return undefined;
  }

  const objectPayload = payload as {
    id?: unknown;
    _embedded?: { leads?: Array<{ id?: unknown }> };
    leads?: Array<{ id?: unknown }>;
  };

  if (typeof objectPayload.id === 'number') {
    return objectPayload.id;
  }

  const embeddedLeadId = objectPayload._embedded?.leads?.find((item) => typeof item.id === 'number')?.id;
  if (typeof embeddedLeadId === 'number') {
    return embeddedLeadId;
  }

  const directLeadId = objectPayload.leads?.find((item) => typeof item.id === 'number')?.id;
  if (typeof directLeadId === 'number') {
    return directLeadId;
  }

  return undefined;
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
  ];

  let leadCustomFields: AmoCustomField[] = [];
  try {
    leadCustomFields = await buildLeadTrackingCustomFields(baseUrl, payload.tracking);
  } catch (error) {
    console.warn('Could not map tracking fields to AmoCRM custom fields:', error);
  }

  const requestBody: {
    name: string;
    pipeline_id: number;
    status_id: number;
    custom_fields_values?: AmoCustomField[];
    tags_to_add?: AmoTag[];
    _embedded: {
      contacts: Array<{
        name: string;
        first_name: string;
        last_name: string;
        custom_fields_values: AmoCustomField[];
      }>;
    };
  } = {
    name: payload.leadName,
    pipeline_id: pipelineId,
    status_id: statusId,
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
  };

  if (leadCustomFields.length > 0) {
    requestBody.custom_fields_values = leadCustomFields;
  }

  const tagsToAdd = toAmoTags(payload.tags);
  if (tagsToAdd.length > 0) {
    requestBody.tags_to_add = tagsToAdd;
  }

  const response = await fetch(`${baseUrl}/api/v4/leads/complex`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${AMOCRM_ACCESS_TOKEN}`,
    },
    body: JSON.stringify([requestBody]),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`AmoCRM API error (${response.status}): ${body}`);
  }

  const result = await response.json().catch(() => null);
  const leadId = extractLeadId(result);
  if (payload.noteText && !leadId) {
    throw new Error(`AmoCRM lead created but id not found in response: ${JSON.stringify(result)}`);
  }

  if (payload.noteText && leadId) {
    await addLeadNote(baseUrl, leadId, payload.noteText);
  }
}
