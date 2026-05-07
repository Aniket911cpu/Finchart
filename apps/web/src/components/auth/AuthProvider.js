'use client';
import { SessionProvider } from 'next-auth/react';
export function AuthProvider({ children }) {
    return <SessionProvider>{children}</SessionProvider>;
}
//# sourceMappingURL=AuthProvider.js.map