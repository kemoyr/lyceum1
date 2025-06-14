// Базовый URL API
const API_URL = 'http://localhost:8000';

export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const logout = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
};

export const getCurrentUser = async () => {
  const token = getToken();
  
  if (!token) {
    throw new Error('Не авторизован');
  }
  
  const response = await fetch(`${API_URL}/users/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      logout();
      throw new Error('Сессия истекла, пожалуйста, войдите снова');
    }
    throw new Error('Ошибка при получении данных пользователя');
  }
  
  return await response.json();
};

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getToken();
  
  if (!token) {
    throw new Error('Не авторизован');
  }
  
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`
  };
  
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      logout();
      throw new Error('Сессия истекла, пожалуйста, войдите снова');
    }
    throw new Error(`Ошибка запроса: ${response.statusText}`);
  }
  
  return await response.json();
}; 