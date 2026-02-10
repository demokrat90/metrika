# Metrika Landing

## Run locally

Install dependencies and start development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## AmoCRM integration

The project sends leads from:
- `POST /api/submit-lead`
- `POST /api/submit-quiz`

Configure environment variables in `.env.local`:

```bash
# Use one of these:
AMOCRM_BASE_URL=https://yourcompany.amocrm.ru
# AMOCRM_BASE_URL=https://yourcompany.kommo.com
# or short subdomain form:
# AMOCRM_SUBDOMAIN=yourcompany

AMOCRM_ACCESS_TOKEN=your_long_lived_token

# Target funnel/stage by names (default behavior in code)
AMOCRM_PIPELINE_NAME=Administrators
AMOCRM_STATUS_NAME=Incoming

# Optional explicit IDs (override names when both are set)
AMOCRM_PIPELINE_ID=1234567
AMOCRM_STATUS_ID=7654321
```

Notes:
- `AMOCRM_ACCESS_TOKEN` is required.
- Either `AMOCRM_BASE_URL` or `AMOCRM_SUBDOMAIN` must be set.
- Leads are created via `/api/v4/leads/complex` directly in the configured funnel/stage.

## Build

```bash
npm run build
npm run start
```
