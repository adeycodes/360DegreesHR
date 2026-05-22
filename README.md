# 360DegreesHR

A comprehensive Next.js HRMS (Human Resource Management System) frontend with complete authentication, dashboard, and design system. Built with Figma-aligned components and modern web technologies.

## ✨ Features

- **🔐 Authentication**
  - User sign up with email verification
  - Secure login with session management
  - Password reset flow
  - SSO integration ready

- **📊 Dashboard**
  - Analytics overview
  - Employee management
  - HRIS module access
  - User settings

- **🎨 Design System**
  - Complete UI component library
  - Color scales and typography system
  - Icon system with multiple weights
  - Figma-aligned design tokens

## Stack

- **Framework:** Next.js 16 App Router
- **UI:** shadcn/ui + design-system components
- **Typography:** Manrope (brand) + Open Sans (UI)
- **Styling:** Tailwind CSS v4 tokens
- **State Management:** Zustand stores
- **Validation:** Zod schemas

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

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/adeycodes/360DegreesHR.git
cd 360DegreesHR

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Available Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm start` — Start production server
- `npm run lint` — Run ESLint
- `npm run format` — Format code with Prettier

## Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── (auth)/         # Authentication routes
│   ├── (protected)/    # Protected/authenticated routes
│   └── (marketing)/    # Marketing pages
├── components/         # React components
│   ├── design-system/  # Design system components
│   ├── features/       # Feature-specific components
│   ├── ui/            # Base UI components
│   ├── shared/        # Shared components
│   └── providers/     # Context providers
├── config/            # Configuration files
├── hooks/             # Custom React hooks
├── lib/               # Utility functions & libraries
├── stores/            # Zustand state stores
├── styles/            # Global styles
└── types/             # TypeScript type definitions
```

## MVP Status

**Completed:**
- ✅ Authentication module (Sign Up, Login, Password Reset)
- ✅ Dashboard with analytics overview
- ✅ Design system with components and tokens
- ✅ API layer structure and endpoints
- ✅ Form validation with Zod

**In Progress:** HRIS module (Employees, Departments, Documents, Disciplinary)

**Docs:** 
- [docs/MVP.md](docs/MVP.md) — Feature checklist
- [docs/API.md](docs/API.md) — API endpoints reference
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — Architecture decisions

### Routes

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

## Key Conventions

### Zod Validation

All API requests and responses are validated using Zod schemas located in `src/lib/validations/`:

```typescript
import { authSchema } from "@/lib/validations/auth";

const validated = authSchema.parse(data);
```

### State Management

Zustand stores in `src/stores/` handle client-side UI state:

```typescript
import { useAuthStore } from "@/stores/auth-store";

const { user, login, logout } = useAuthStore();
```

### API Integration

API calls are centralized in `src/lib/api/`:
- `client.ts` — HTTP client with interceptors
- `endpoints/` — API endpoint definitions
- `errors.ts` — Error handling

## Contributing

1. Follow the architecture patterns in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
2. Keep components in feature-specific folders
3. Add validations for all API calls using Zod
4. Use Zustand for shared state
5. Run `npm run lint` before committing

## License

This project is proprietary. All rights reserved.

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
