'use client';

import React, { ReactNode, useEffect } from 'react';
import { useAuth } from '@/context';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles = ['admin'] }: ProtectedRouteProps) {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/admin/login');
      } else if (user && !allowedRoles.includes(user.role)) {
        // Redirect to home or unauthorized page if user doesn't have required role
        router.push('/');
      }
    }
  }, [isAuthenticated, user, loading, router, allowedRoles]);

  // Show loading state while checking auth
  if (loading) {
    return React.createElement(
      'div',
      { className: 'min-h-screen flex items-center justify-center bg-[#e6e7e9]' },
      React.createElement(
        'div',
        { className: 'text-center' },
        React.createElement('p', { className: 'text-gray-600' }, 'Checking authentication...')
      )
    );
  }

  // If user is authenticated and has the right role, show the content
  if (isAuthenticated && user && allowedRoles.includes(user.role)) {
    return children;
  }

  // If not authenticated or wrong role, return null (will be redirected by useEffect)
  return null;
}