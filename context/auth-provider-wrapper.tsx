'use client';

import React, { ReactNode } from 'react';
import { AuthProvider as ActualAuthProvider } from './index'; // Import the actual provider

export default function AuthProviderWrapper({ children }: { children: ReactNode }) {
  return <ActualAuthProvider>{children}</ActualAuthProvider>;
}