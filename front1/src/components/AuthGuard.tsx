"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '../utils/api';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  
  useEffect(() => {
    // Проверка авторизации пользователя
    const checkAuth = () => {
      if (!isAuthenticated()) {
        // Если пользователь не авторизован, перенаправляем его на страницу входа
        router.push('/login');
      } else {
        setAuthorized(true);
      }
    };
    
    checkAuth();
    
    // Добавляем обработчик событий истории браузера для перепроверки авторизации
    const handleRouteChange = () => {
      checkAuth();
    };
    
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [router]);
  
  // Показываем контент только если пользователь авторизован
  return authorized ? <>{children}</> : null;
} 