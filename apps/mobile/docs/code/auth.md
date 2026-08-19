# Authentication & Security

This template includes a complete authentication system with secure storage, state management, and route protection. The implementation demonstrates best practices for React Native authentication.

## Overview

The authentication system consists of:

- **Zustand store** for authentication state management
- **Secure storage** using `expo-secure-store` for token persistence
- **Route guards** that protect authenticated routes
- **Splash screen controller** for handling authentication state during app startup

## Architecture

### Authentication Store (`modules/auth/stores/authStore.ts`)

The authentication state is managed using Zustand:

```typescript
interface AuthState {
  token?: string | null;
  isLoading: boolean;
}

interface AuthActions {
  login: (token: string) => void;
  logout: () => void;
  restore: (token: string | null) => void;
}
```

**Key features:**

- `login(token)` - Sets token and persists to secure storage
- `logout()` - Clears token and removes from storage
- `restore(token)` - Restores token from storage on app startup
- `isLoading` - Tracks authentication state during app initialization

### Secure Storage (`utils/secureStore.ts`)

Handles secure token storage across platforms:

- **iOS/Android**: Uses `expo-secure-store` for encrypted storage
- **Web**: Falls back to `localStorage` with error handling
- **Cross-platform**: Automatic platform detection and appropriate storage method

### Authentication Hook (`hooks/useSecureStorageState.ts`)

Provides a React hook for secure storage operations:

```typescript
const [token, setToken] = useSecureStorageState("auth_token");
```

**Features:**

- Automatic loading state management
- Secure storage integration
- Platform-specific storage handling
- Error handling for storage failures

## Route Protection

### Authentication Guards

Routes are protected using `Stack.Protected` components in the root layout:

```typescript
<Stack.Protected guard={!!token}>
  <Stack.Screen name="(app)" />
</Stack.Protected>
<Stack.Protected guard={!token}>
  <Stack.Screen name="index" />
  <Stack.Screen name="sign-up" />
</Stack.Protected>
```

**Protected routes:**

- `guard={!!token}` - Only accessible when authenticated
- `guard={!token}` - Only accessible when not authenticated

### Splash Screen Controller

The `SplashScreenController` component handles the authentication flow during app startup:

1. **Shows splash screen** while checking authentication state
2. **Restores token** from secure storage
3. **Updates auth store** with restored token
4. **Hides splash screen** once authentication state is determined

## Template Customization

### For Your Own App

1. **Replace demo authentication flow**:
   - Update login/signup screens in `app/index.tsx` and `app/sign-up.tsx`
   - Customize authentication API calls
   - Modify token format if needed

2. **Customize authentication store**:
   - Add user profile data to the store
   - Include additional authentication fields (refresh tokens, user roles, etc.)
   - Add authentication methods (social login, biometrics, etc.)

3. **Update secure storage keys**:
   - Modify `STORAGE_KEYS` in `constants/storage.ts`
   - Add additional secure storage for user preferences, settings, etc.

4. **Enhance route protection**:
   - Add role-based access control
   - Implement feature flags
   - Add subscription-based route protection

## Security Best Practices

### Token Management

- **Secure storage**: Always use `expo-secure-store` for sensitive data
- **Token expiration**: Implement token refresh logic
- **Logout cleanup**: Clear all stored authentication data on logout

### Route Protection

- **Guard consistency**: Ensure all protected routes use proper guards
- **Loading states**: Handle authentication loading states properly
- **Error boundaries**: Implement error handling for authentication failures

## Dependencies

The authentication system requires:

```json
{
  "expo-secure-store": "~15.0.7",
  "zustand": "^4.4.7"
}
```

## Template Instructions

- **Review the authentication flow**: Understand how login/logout works
- **Customize for your app**: Replace demo screens with your authentication UI
- **Add your API integration**: Connect to your authentication backend
- **Test authentication flows**: Ensure login/logout works correctly
- **Remove demo content**: Delete any authentication-related demo code you don't need
