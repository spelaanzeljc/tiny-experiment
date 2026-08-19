# Routing

We are using Expo Router (https://docs.expo.dev/router/advanced/stack/). It is the standard library for the new React Native expo applications. The routing is file based and is defined in the `app` folder.

## Authentication Guards

The app uses authentication guards to protect routes. The root layout (`app/_layout.tsx`) implements a `Stack.Protected` component that conditionally renders routes based on authentication state:

- **Authenticated routes**: Protected by `guard={!!token}` - only accessible when user is logged in
- **Unauthenticated routes**: Protected by `guard={!token}` - only accessible when user is not logged in

## Route Structure

### Root Level (`app/`)

**Unauthenticated routes** - accessible when user is not logged in:

- `/` - Entry point (index.tsx) - typically login/landing page
- `/sign-up` - Sign up page

### Authenticated App Routes (`app/(app)/`)

The `(app)` group contains all authenticated routes. This group is only accessible when the user is logged in.

#### Tab Navigation (`app/(app)/(tabs)/`)

The `(tabs)` group provides tab-based navigation for the main app screens. **Customize these tabs for your app:**

- `/` - Main tab (index.tsx) - typically home/dashboard
- `/flowers` - Example feature tab with nested stack navigation
- `/account` - User account/profile tab

#### Nested Stack Navigation

**Example pattern** - `app/(app)/(tabs)/flowers/`:

- `/flowers/` - List view (index.tsx)
- `/flowers/[name]` - Dynamic route for details (e.g., `/flowers/item-123`)

#### Modal Routes (`app/(app)/`)

**Example pattern** - modal presentation:

- `/create` - Create new item modal (presented as modal)

## Layout Hierarchy

1. **Root Layout** (`app/_layout.tsx`): Handles authentication guards and global providers
2. **App Layout** (`app/(app)/_layout.tsx`): Manages authenticated app routes
3. **Tab Layout** (`app/(app)/(tabs)/_layout.tsx`): Configures tab navigation
4. **Flowers Layout** (`app/(app)/(tabs)/flowers/_layout.tsx`): Manages flowers stack navigation

## Dynamic Routes

Dynamic routes use square brackets in the filename:

- `[name].tsx` creates a route that accepts a `name` parameter
- Access parameters using `useLocalSearchParams()` hook

## Navigation Features

- **Tab Navigation**: Bottom tab bar with custom icons and styling
- **Stack Navigation**: Nested stack navigation for feature sections
- **Modal Presentation**: Screens presented as modals
- **Authentication Guards**: Automatic route protection based on auth state
- **Header Configuration**: Customizable headers per route

## Template Customization

### For Your Own App

1. **Replace demo routes**: Remove the `flowers` tab and replace with your app's main features
2. **Update tab configuration**: Modify `app/(app)/(tabs)/_layout.tsx` to add/remove tabs
3. **Customize tab icons**: Update the `TabBarIcon` component with your app's icons
4. **Add your routes**: Create new route files following the same patterns:
   - Static routes: `page.tsx`
   - Dynamic routes: `[param].tsx`
   - Layouts: `_layout.tsx`
5. **Authentication flow**: Customize the login/signup flow in the unauthenticated routes
6. **Remove unused routes**: Delete any demo routes you don't need

### Common Patterns

- **List → Detail**: Use nested stack navigation (like the flowers example)
- **Create/Edit modals**: Use modal presentation for forms
- **Settings/Profile**: Use dedicated tabs or stack navigation
