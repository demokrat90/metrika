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
