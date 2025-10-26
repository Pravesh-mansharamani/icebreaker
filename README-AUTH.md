# Authentication with Slush Wallet

This project uses the Sui dApp Kit with Slush wallet support for Sui blockchain authentication with Google login support. Slush wallet is supported out of the box by the dApp Kit.

## Features

- ✅ Slush wallet integration with Sui blockchain
- ✅ Google login support (creates wallet automatically for new users)
- ✅ Automatic wallet creation for first-time users
- ✅ Protected routes with middleware
- ✅ API authentication endpoints
- ✅ Secure session management with cookies

## How It Works

### Authentication Flow

1. **User visits `/auth` page**
   - If not authenticated, user sees login screen
   - User clicks "Connect with Slush"
   - Slush wallet modal opens

2. **Wallet Connection**
   - Slush wallet handles wallet connection
   - If user has no wallet, Slush creates one via Google OAuth
   - User connects their wallet

3. **Session Creation**
   - Wallet address is sent to `/api/auth/callback`
   - Server creates authentication cookie
   - User is redirected to `/feed`

4. **Protected Routes**
   - Middleware checks for authentication cookie
   - If missing, user is redirected to `/auth`
   - If present, user can access protected routes

5. **Logout**
   - User clicks logout button in navigation
   - Cookie is cleared
   - Wallet is disconnected
   - User is redirected to `/auth`

## Provider Structure

The app follows the recommended Sui dApp Kit provider structure:

```tsx
<QueryClientProvider>
  <SuiClientProvider networks={networkConfig} defaultNetwork="devnet">
    <WalletProvider autoConnect>
      {/* Your app components */}
    </WalletProvider>
  </SuiClientProvider>
</QueryClientProvider>
```

**Important:** Slush wallet is supported automatically by the dApp Kit. No manual registration is needed!

## Environment Variables

Optional: You can configure the Slush API URL by adding to your `.env.local`:

```env
NEXT_PUBLIC_SLUSH_API_URL=https://api.slush.is
```

## API Endpoints

### `/api/auth/status`
- **Method**: GET
- **Description**: Check if user is authenticated
- **Returns**: `{ authenticated: boolean }`

### `/api/auth/callback`
- **Method**: POST
- **Description**: Set authentication cookie
- **Body**: `{ address: string }`
- **Returns**: `{ success: boolean }`

### `/api/auth/logout`
- **Method**: POST
- **Description**: Clear authentication cookie
- **Returns**: `{ success: boolean }`

## Protected Routes

The following routes are protected by the authentication middleware:
- `/feed`
- `/quests`
- `/upload`
- `/share`
- `/profile`

## Public Routes

- `/auth` - Login page

## Components Updated

1. **`app/providers.tsx`**
   - Added `SuiClientProvider` with network configuration (devnet, mainnet, testnet, localnet)
   - Added `WalletProvider` with autoConnect enabled
   - Slush wallet is supported out of the box - no manual registration needed
   - Wrapped app with QueryClientProvider for React Query

2. **`app/auth/page.tsx`**
   - Integrated `ConnectModal` from `@mysten/dapp-kit`
   - Added wallet connection handling
   - Added automatic redirection on successful connection

3. **`components/cyber-navigation.tsx`** & **`components/navigation.tsx`**
   - Added logout button
   - Integrated `useCurrentWallet` hook
   - Added logout handler

4. **`middleware.ts`**
   - Created authentication middleware
   - Redirects unauthenticated users to `/auth`
   - Allows public access to `/auth` and `/api/*` routes

## Testing

1. Start the development server:
   ```bash
   pnpm dev
   ```

2. Navigate to the app (will redirect to `/auth`)

3. Click "Connect with Slush"

4. In the modal:
   - If you don't have a wallet: Select "Sign in with Google" to create one
   - If you have a wallet: Select your wallet and connect

5. You should be redirected to `/feed` and see the logout button in the navigation

6. Try accessing other protected routes without authentication - you should be redirected to `/auth`

## Notes

- **Slush wallet is supported automatically** by the Sui dApp Kit - no need to register it manually
- Slush wallet creates a secure wallet for users automatically via Google login
- The wallet is stored in the browser and persisted across sessions
- Authentication token is stored in a cookie (24-hour expiry)
- All wallet operations are handled by `@mysten/dapp-kit`
- The app uses devnet by default - change `defaultNetwork="devnet"` in providers.tsx to switch networks

