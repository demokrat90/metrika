# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev       # Start development server (localhost:3000)
npm run build     # Production build
npm run start     # Run production server
npm run lint      # Run ESLint
```

## Architecture Overview

This is a Next.js 16 Arabic real estate landing page for Dubai luxury properties. Single-page layout with section-based components and optional AmoCRM CRM integration.

### Component Structure

**Main Page** (`src/app/page.tsx`): Client component that coordinates all sections and manages popup state.

**Quiz System** (`src/components/Quiz/`): 8-step lead capture funnel with:
- `QuizContainer.tsx` - State management, step navigation, form submission
- `QuizStep.tsx` - Renders individual steps (options + contact fields)
- `src/lib/quiz-data.ts` - Step definitions and TypeScript types

**API Routes** (`src/app/api/`):
- `submit-quiz/route.ts` - Quiz completion with AmoCRM integration
- `submit-lead/route.ts` - Popup form leads with AmoCRM integration

### Key Patterns

- All interactive components use `'use client'` directive
- RTL layout: `lang="ar" dir="rtl"` in root HTML
- Phone inputs use LTR direction with +971 prefix
- Colors via CSS variables: `--color-dark: #171717`, `--color-gold: #a39466`
- Tailwind CSS v4 with PostCSS plugin

### Environment Variables

```bash
AMOCRM_SUBDOMAIN=     # e.g., yourcompany.amocrm.ru
AMOCRM_ACCESS_TOKEN=  # Long-lived access token
AMOCRM_PIPELINE_ID=   # Pipeline ID for new leads
```

AmoCRM integration is optional - forms work without credentials configured.

### Image Configuration

Remote patterns configured in `next.config.ts` for Tilda CDN:
- `static.tildacdn.com`
- `optim.tildacdn.com`

### Path Alias

`@/*` maps to `./src/*` (configured in tsconfig.json)

## Google Ads Offline Conversions

Офлайн-конверсии отправляются в Google Ads через Google Sheets.

### Архитектура

```
AmoCRM (смена статуса) → Webhook → Cloudflare Worker → Google Sheets → Google Ads (раз в день)
```

### Cloudflare Workers

**Активный:** `https://offline.singularity-mcp.workers.dev` — офлайн-конверсии.

**Неактивный:** Worker "amocrm" (прокси для sGTM `ss.metrika.ae/amo-webhook`) — вебхук не настроен, можно удалить.

**Секреты Worker (offline):**
- `AMO_ACCESS_TOKEN` — токен AmoCRM API
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` — email сервисного аккаунта Google
- `GOOGLE_PRIVATE_KEY` — приватный ключ сервисного аккаунта
- `GOOGLE_SHEET_ID` — ID Google таблицы
- `LEAD_CACHE` — KV namespace (создан, но не используется в коде)

**Логика:**
1. Получает webhook от AmoCRM (URL-encoded формат)
2. Проверяет поле `live_lead` в AmoCRM — если "yes", пропускает
3. Извлекает GCLID из поля `gclid` или из cookies
4. Получает email и телефон из привязанного контакта
5. Хеширует email и телефон (SHA256)
6. Пропускает лид, если нет ни GCLID, ни email, ни телефона
7. Записывает в Google Sheets
8. Ставит `live_lead = yes` в AmoCRM

**Время конверсии:** `new Date()` в Cloudflare Workers возвращает UTC. Worker вручную сдвигает на +4 часа (Dubai) перед записью с суффиксом `+04:00`.

**Поле live_lead:** field_id = `970831`

### Google Sheets

**ID:** `18pZXGnuUSF2ISRGGixf7KR7_zevAx4_86yKqOdV_XGE`

**Структура (Лист1):**
| Колонка | Поле |
|---------|------|
| A | Conversion_Time |
| B | Google_Click_ID (GCLID) |
| C | Email (SHA256 hash) |
| D | Phone (SHA256 hash, E.164) |
| E | Conversion_Value |
| F | Currency (AED) |
| G | Order_ID (lead ID) |

### AmoCRM Webhook

Настроен на событие `leads[status]` (смена статуса сделки).
URL: `https://offline.singularity-mcp.workers.dev`

**Важно:** Не использовать `leads[update]` — триггерит при любом изменении сделки.

### Google Ads Import

Расписание: каждый день 19:00–20:00 (GMT+04:00).
Google Ads читает всю таблицу, дедуплицирует по `Order_ID`.
