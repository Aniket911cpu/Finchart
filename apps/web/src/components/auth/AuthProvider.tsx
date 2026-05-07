'use client';
import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../lib/firebase';
import { User } from 'firebase/auth';

interface AuthContextType {
  user: User | null | undefined;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: undefined, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  // Safe hook call even if auth is undefined
  const [user, loading] = useAuthState(auth as any);
  
  if (!auth) {
    return <>{children}</>;
  }
  
  // Optional: Handle token refresh or custom claims here
  
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
