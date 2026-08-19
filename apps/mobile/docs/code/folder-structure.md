# Folder structure

This project follows the folder structure in which most of the code that is related is grouped together (colocation).

## The structure

The structure below is shortened for brevity and shows the most important folders.

```
├── app/                          # Expo Router file-based routing
│   ├── _layout.tsx              # Root layout with auth guards
│   ├── index.tsx                # Entry point (login/landing)
│   ├── sign-up.tsx              # Sign up page
│   └── (app)/                   # Authenticated app routes
│       ├── _layout.tsx          # App layout for authenticated users
│       ├── create.tsx           # Modal routes
│       └── (tabs)/              # Tab navigation
│           ├── _layout.tsx      # Tab layout configuration
│           ├── index.tsx         # Home tab
│           ├── account.tsx       # Account tab
│           └── flowers/         # Example feature with nested navigation
│               ├── _layout.tsx  # Stack layout
│               ├── index.tsx    # List view
│               └── [name].tsx   # Dynamic details
├── components/                   # Reusable UI components
│   ├── buttons/                 # Button components
│   ├── input/                   # Form input components
│   ├── navigation/              # Navigation components
│   └── ...
├── constants/                   # Global constants
├── hooks/                       # Global custom hooks
├── modules/                     # Feature-specific modules
│   ├── auth/                    # Authentication module
│   │   ├── components/          # Auth-related components
│   │   └── stores/              # Auth state management
│   └── ...
├── utils/                       # Utility functions and providers
│   ├── providers/               # React context providers
│   ├── theme/                   # Theme configuration
│   └── secureStore.ts           # Secure storage utilities
└── types/                       # TypeScript type definitions
```

## Key Folders

### App Directory (`app/`)

- **File-based routing**: Each file represents a route
- **Layout groups**: `(app)` and `(tabs)` create navigation groups
- **Authentication guards**: Routes are protected by auth state
- **Dynamic routes**: `[name].tsx` creates parameterized routes

### Components (`components/`)

- **Reusable UI components**: Buttons, inputs, navigation
- **Design system**: Consistent component library

### Hooks (`hooks/`)

- **Global custom hooks**: Shared logic across the app
- **Theme hooks**: Access to design system and theming
- **Storage hooks**: Secure storage state management
- **Reusable logic**: Common patterns extracted into hooks

### Modules (`modules/`)

- **Feature colocation**: Related functionality grouped together
- **Authentication module**: Auth state, components, and utilities
- **Feature modules**: Example flowers module with components and tests
- **Scalable structure**: Easy to add new features

### Utils (`utils/`)

- **Providers**: React context providers for global state
- **Theme system**: Design tokens and theming utilities
- **Secure storage**: Cross-platform secure storage
- **API utilities**: REST client and query management

Refer to documentation for each folder / module for more information.

## Template instructions

Remove this section after reading through the file. Make sure to document any changes in the folder structure.
