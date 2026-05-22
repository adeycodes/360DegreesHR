# 360DegreesHR

Next.js HRMS frontend with a complete design system and Figma-aligned auth + dashboard UI.

## Stack

- **Framework:** Next.js 16 App Router
- **UI:** shadcn/ui + design-system components
- **Typography:** Manrope (brand) + Open Sans (UI)
- **Styling:** Tailwind CSS v4 tokens

## Design system

Live reference: [http://localhost:3000/design-system](http://localhost:3000/design-system)

| Pillar | Location |
|--------|----------|
| **Tokens (TS)** | `src/config/design-system/` |
| **Tokens (CSS)** | `src/styles/design-system/` |
| **Components** | `src/components/design-system/` |

### Colors

- **Main:** Primary `#274376`, Secondary `#F7A316` (50–500 scales)
- **Alerts:** Success `#0CAF60`, Warning `#FFD023`, Error `#E03137`
- **Greyscale:** 50–900
- **Additional:** White, Orange `#FE984A`, Blue `#2F7BEE`, Purple `#8C62FF`

### Typography

- `text-h1` … `text-h6`, `text-body-1` … `text-body-3`, `text-quote`, `font-brand`

### Icons

```tsx
import { Icon } from "@/components/design-system/icon";

<Icon name="settings" weight="regular" size="md" />
```

Weights: `thin` (1px) · `regular` (1.5px) · `bold` (2.5px)

## Getting started

```bash
cp .env.example .env.local
npm install
npm run dev
```

## MVP status

**Active:** Module 1 (HRIS) + auth + dashboard API layer.  
**Docs:** [docs/MVP.md](docs/MVP.md) · [docs/API.md](docs/API.md) · [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

| Flow | Route |
|------|-------|
| Splash | `/splash` |
| Create company | `/register` |
| Login (SSO) | `/login` |
| Login (password) | `/login/password` |
| Forgot / reset password | `/forgot-password` · `/forgot-password/sent` · `/reset-password?token=` |
| Dashboard | `/dashboard` |
| HRIS (placeholders) | `/hris/employees` · `/hris/departments` · `/hris/documents` · `/hris/disciplinary` |

Update backend paths in **`src/config/api-paths.ts`** when you share the real API contract.

## Architecture

See **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** for folder rules, Zod, Zustand, and API conventions.

| Concern | Location |
|---------|----------|
| **Zod** | `src/lib/validations/` — schemas + `parseApiResponse` |
| **Zustand** | `src/stores/` — client UI state |
| **API (later)** | `src/lib/api/` — `client.ts` + `endpoints/` |
| **Features (MVP)** | `src/components/features/` — one folder per screen/flow |

## Project structure

```
src/
├── app/(auth)/               # login, register, forgot-password
├── app/(protected)/          # dashboard, hris/[section]
├── components/features/      # auth/screens, dashboard, hris, splash
├── components/shared/auth/   # split layout, fields, footer
├── lib/api/                  # Backend integration
├── lib/validations/          # Zod
└── config/                   # routes, navigation, hris-pages, api-paths
```

See **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** for full layout and conventions.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript |
