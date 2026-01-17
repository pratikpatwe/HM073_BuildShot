# Project Rules

## Project Context
- **Name**: Kairos
- **Type**: Modern Web Application
- **Methodology**: Agile, Fast-Paced, Quality-First

## Tech Stack
### Core
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS (Vanilla)
- **State Management**: React Hooks (Zustand if complex global state is needed)
- **Database**: Prisma ORM with PostgreSQL / MongoDB (as needed)

### UI/UX Libraries
- **Components**: Shadcn/UI (Radix Primitives)
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Coding Standards

### General
- **Functional Components**: Use functional components with hooks for all UI logic.
- **Server Components**: Use React Server Components (RSC) by default. Only use `'use client'` when interactivity (state, effects, event listeners) is strictly required.
- **Type Safety**: No `any`. Define proper interfaces for all props and data structures.
- **Naming**: 
  - Components: PascalCase (e.g., `Button.tsx`, `UserProfile.tsx`)
  - Functions/Variables: camelCase (e.g., `fetchUserData`, `isLoading`)
  - Constants: UPPER_SNAKE_CASE (e.g., `MAX_RETRIES`)
- **Imports**: Use absolute imports with `@/` alias (e.g., `import { Button } from '@/components/ui/button'`).

### Project Structure (Next.js App Router)
- `app/`: Application routes and pages.
- `components/`: Reusable UI components.
  - `ui/`: Design system primitives (buttons, inputs, etc.).
  - `[feature]/`: Feature-specific components.
- `lib/`: Utility functions, helpers, and configurations.
- `hooks/`: Custom React hooks.
- `types/`: Global TypeScript type definitions.

### Component Structure
```tsx
import { FC } from 'react'

interface MyComponentProps {
  title: string
  isActive?: boolean
}

export const MyComponent: FC<MyComponentProps> = ({ title, isActive = false }) => {
  return (
    <div className={isActive ? 'bg-blue-500' : 'bg-gray-200'}>
      <h1>{title}</h1>
    </div>
  )
}
```

## UI/UX Guidelines
- **Aesthetics**: Aim for a premium, modern feel.
  - Use subtle gradients and glassmorphism where appropriate.
  - Ensure generous padding and whitespace.
  - Use `inter` or a similar clean sans-serif font.
- **Responsiveness**: Mobile-first design. Ensure all layouts work seamlessly on mobile, tablet, and desktop.
- **Accessibility**: Semantic HTML is non-negotiable. Use proper ARIA attributes when necessary.
- **Dark Mode**: Support dark mode by default using Tailwind's `dark:` modifier.

## Agent Behavior
- **Proactive**: Don't ask for permission to fix obvious bugs or syntax errors.
- **Concise**: Keep responses short and actionable.
- **Context-Aware**: Always check `task.md` and current file state before acting.
- **Safe Operations**: Ask before deleting large chunks of code or changing architecture significantly.
