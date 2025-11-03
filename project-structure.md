## Architecture Principles

- **Feature-Sliced**: Each feature is self-contained in `features/`
- **UI vs Logic**: `app/` = routing + page UI, `features/` = logic
- **State**: React Query (server), Zustand (client)
- **No Relative Path Hell**: Use `@/` alias in `tsconfig.json`

# Project Directory Structure

├── src/
│   ├── app/                              # Next.js App Router
│   │   ├── layout.tsx                    # Root layout with QueryClientProvider
│   │   ├── page.tsx                      # Main page with prefetched queries
│   │   ├── globals.css                   # Global styles (Tailwind)
│   │   └── [feature]/                    # Feature-specific routes (e.g., /posts, /users)
│   │       ├── components/               # Feature-specific UI components
│   │       │   ├── [Feature]List.tsx     # List component (uses React Query)
│   │       │   ├── [Feature]Form.tsx     # Form component (uses React Query + Zustand)
│   │       │   └── [Feature]Filter.tsx   # Filter component (uses Zustand)
│   │       ├── page.tsx                  # Feature page (Server Component)
│   │       └── [id]/page.tsx             # Dynamic routes
│   ├── components/                       # Global Shared and Reusable UI components
│   │   └── ui/                           # Shared shadcn components (e.g., Button, Modal)
│   ├── constants/                        # Global Fixed values used within the app.
│   ├── features/                         # Feature-related logics & UI (e.g., /posts, /users)
│   │   ├── constants/                    # Fixed values used within the feature.
│   │   │   └── [Feature].constant.ts     # Feature-related constants (e.g., useFilterStore)
│   │   ├── stores/                       # Zustand stores
│   │   │   └── use[Feature].store.ts     # Feature-specific stores (e.g., useFilterStore)
│   │   ├── apis/                         # API call functions
│   │   │   └── [Feature].api.ts          # Feature-specific API calls
│   │   ├── queries/                      # React Query hooks
│   │   │   ├── use[Feature]Query.ts      # Query hooks (e.g., usePostsQuery)
│   │   │   └── use[Feature]Mutation.ts   # Mutation hooks (e.g., useCreatePostMutation)
│   │   └── types/                        # TypeScript types for internal interfaces (e.g, NavItems)
│   │       └── NavItem.type.ts           # Feature-specific interfaces
│   ├── hooks/                            # Global Shared and Reusable related UI hooks
│   ├── interfaces/                       # TypeScript interfaces for DB interfaces/DTOs/Schemas/Models
│   │   └── User.interface.ts             # Shared types (e.g., Post, User)
│   ├── lib/                              # Shared utilities and setup
│   │   ├── queryClient.ts                # React Query client setup
│   │   ├── axios.ts                      # Axios instance (interceptors, baseURL, etc.)
│   │   ├── axiosServer.ts                # Axios for Server Components
│   │   └── utils.ts                      # Utility functions
│   ├── providers/                        # React Context Providers
│   └── stores/                           # Global Zustand stores
├── public/                               # Static assets
├── package.json                          # Dependencies
├── next.config.ts                        # Next.js config
└── tsconfig.json                         # TypeScript config (if using TypeScript)

# Explanation

- **[app/]:** Contains all Next.js routing logic, page-level Server Components and page-related components.

- **[components/]:** Houses global reusable UI components shared across the application.

- **[constants/]:** Contains global constants and configuration values shared across multiple features, such as app-wide enums, keys, or messages.

- **[features/]:** Encapsulates feature-specific logic and UI, making each feature self-contained and modular. Each feature acts as a mini-module, holding its own domain logic, API calls, Zustand store, and React Query hooks.
  - **[constants/]:** Fixed values related to the feature (e.g., filters, default settings).
  - **[stores/]:** Zustand stores that handle UI or feature-specific state (e.g., search filters or form data).
  - **[apis/]:** Centralized API call definitions for the feature (using Axios instances).
  - **[queries/]:** React Query hooks for data fetching and mutations (e.g., usePostsQuery, useCreatePostMutation).
  - **[types/]:** TypeScript types or interfaces used internally within the feature.

- **[hooks/]:** Contains global reusable React hooks (not specific to any feature), such as media query hooks, scroll tracking, or form helpers.

- **[lib/]:** Central place for React Query setup (queryClient.js), axios setup and other utilities.

- **[stores/]:** Contains global Zustand stores shared across multiple features, such as authentication, theme, or layout states. Feature-specific stores should remain inside their respective feature folders.

- **[providers/]:** Includes React Context Providers that wrap the app globally (e.g., theme, authentication, query client, or Zustand hydration). These are imported and used in the root layout to initialize the global app context.

- **[interfaces/]:** Defines domain-level TypeScript interfaces, such as DTOs, database schemas, or API response shapes shared across multiple features.

- **[public/]:** Stores static assets like images, fonts, and icons that can be directly served by Next.js.