# Project Structure

This document outlines the clean and organized folder structure for the Blockbayan project.

## Directory Structure

```
blockbayan-1/
├── public/                          # Static assets
│   ├── images/                      # Image files
│   └── icons/                       # Icon files
│
├── src/
│   ├── app/                         # Next.js 15 App Router
│   │   ├── (auth)/                  # Authentication route group
│   │   │   ├── login/              # Login page
│   │   │   └── signup/             # Signup page
│   │   │
│   │   ├── (main)/                  # Main application route group
│   │   │   ├── campaign/           # Campaign pages
│   │   │   │   └── [id]/          # Dynamic campaign detail page
│   │   │   ├── create-campaign/    # Create campaign page
│   │   │   ├── dashboard/          # Dashboard page
│   │   │   └── explore/            # Explore campaigns page
│   │   │
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Home page
│   │   ├── loading.tsx             # Global loading component
│   │   └── globals.css             # Global styles
│   │
│   ├── components/                  # React components
│   │   ├── features/               # Feature-specific components
│   │   │   └── modals/            # Modal components
│   │   │       ├── SettingsModal.tsx
│   │   │       ├── WalletConnectModal.tsx
│   │   │       └── WithdrawFundsModal.tsx
│   │   │
│   │   ├── layout/                 # Layout components
│   │   │   └── DashboardHeader.tsx
│   │   │
│   │   ├── sections/               # Landing page sections
│   │   │   ├── hero.tsx
│   │   │   ├── features.tsx
│   │   │   ├── testimonials.tsx
│   │   │   ├── faq-section.tsx
│   │   │   └── new-release-promo.tsx
│   │   │
│   │   ├── shared/                 # Shared/reusable components
│   │   │   ├── ETHPriceTicker.tsx
│   │   │   ├── globe.tsx
│   │   │   ├── marquee.tsx
│   │   │   ├── TextType.tsx
│   │   │   └── ... (other shared components)
│   │   │
│   │   └── ui/                     # Base UI components
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── tabs.tsx
│   │       └── toast.tsx
│   │
│   ├── config/                     # Configuration files
│   │   ├── constants.ts           # Application constants
│   │   └── wallets.ts             # Wallet configuration
│   │
│   ├── hooks/                      # Custom React hooks
│   │   └── (empty - ready for custom hooks)
│   │
│   ├── lib/                        # Utility functions
│   │   ├── fonts.ts               # Font configuration
│   │   ├── load-script.ts         # Script loading utilities
│   │   ├── receipt-utils.ts       # Receipt generation utilities
│   │   └── utils.ts               # General utilities
│   │
│   ├── store/                      # State management
│   │   └── walletStore.ts         # Wallet state management
│   │
│   └── types/                      # TypeScript type definitions
│       ├── index.ts               # Type exports
│       ├── wallet.ts              # Wallet-related types
│       ├── campaign.ts            # Campaign-related types
│       └── modal.ts               # Modal-related types
│
├── components.json                 # shadcn/ui configuration
├── next.config.ts                  # Next.js configuration
├── package.json                    # Dependencies and scripts
├── tailwind.config.ts             # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # Project documentation
```

## Key Improvements

### 1. Route Groups

- **(auth)**: Groups authentication-related pages (login, signup)
- **(main)**: Groups main application pages (dashboard, campaigns, explore)
- These route groups don't affect the URL structure but help organize the codebase

### 2. Component Organization

- **features/**: Feature-specific components that are tightly coupled to business logic
- **layout/**: Components that define the layout structure
- **sections/**: Landing page section components
- **shared/**: Reusable components used across multiple features
- **ui/**: Base UI components (design system)

### 3. Configuration

- Centralized configuration files in `config/`
- Wallet options and blockchain constants separated from components
- Easy to modify and maintain

### 4. Type Safety

- All TypeScript types organized in `types/` directory
- Centralized type exports through `index.ts`
- Easier to maintain and discover types

### 5. Clean Separation of Concerns

- **components/**: Presentation layer
- **lib/**: Business logic and utilities
- **store/**: State management
- **types/**: Type definitions
- **config/**: Configuration
- **hooks/**: Custom React hooks (ready for future additions)

## Import Paths

All imports use absolute paths with the `@/` prefix:

```typescript
// Components
import { Button } from "@/components/ui/button";
import DashboardHeader from "@/components/layout/DashboardHeader";
import WalletConnectModal from "@/components/features/modals/WalletConnectModal";
import { Marquee } from "@/components/shared/marquee";

// Types
import type { WalletOption, Campaign } from "@/types";

// Config
import { WALLET_OPTIONS } from "@/config/wallets";
import { SUPPORTED_CHAINS } from "@/config/constants";

// Utils
import { cn } from "@/lib/utils";
import { generateReceipt } from "@/lib/receipt-utils";

// Store
import { getWalletData } from "@/store/walletStore";
```

## Benefits

1. **Scalability**: Easy to add new features without cluttering the structure
2. **Maintainability**: Clear organization makes it easy to find and modify code
3. **Collaboration**: Team members can quickly understand the project structure
4. **Type Safety**: Centralized types improve code quality and IDE support
5. **Performance**: Better code splitting with organized imports
6. **Standards**: Follows Next.js and React best practices

## Next Steps

- Add custom hooks to `src/hooks/` as needed
- Expand types in `src/types/` for new features
- Add API routes in `src/app/api/` when needed
- Create middleware in `src/middleware.ts` for auth and routing logic
