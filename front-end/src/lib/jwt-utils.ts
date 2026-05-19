import { jwtDecode, JwtPayload } from 'jwt-decode';

export interface DecodedToken extends JwtPayload {
  sub?: string; // email
  name?: string; // nome do usuário
  role?: 'ADMIN' | 'CUSTOMER'; // role do usuário
  iat?: number;
  exp?: number;
}

/**
 * Decodifica um token JWT e retorna seus claims
 * @param token - Token JWT
 * @returns Objeto com os claims do token
 */
export function decodeToken(token: string): DecodedToken | null {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error('Erro ao decodificar token:', error);
    return null;
  }
}

/**
 * Obtém o email do usuário a partir do token armazenado
 * @returns Email do usuário ou null
 */
export function getUserEmailFromToken(): string | null {
  if (typeof window === 'undefined') return null;

  const token = localStorage.getItem('authToken');
  if (!token) return null;

  const decoded = decodeToken(token);
  return decoded?.sub ?? null;
}

/**
 * Obtém o nome do usuário a partir do token armazenado
 * @returns Nome do usuário ou null
 */
export function getUserNameFromToken(): string | null {
  if (typeof window === 'undefined') return null;

  const token = localStorage.getItem('authToken');
  if (!token) return null;

  const decoded = decodeToken(token);
  return decoded?.name ?? null;
}

/**
 * Obtém a role do usuário a partir do token armazenado
 * @returns Role do usuário ('ADMIN' | 'CUSTOMER') ou null
 */
export function getUserRoleFromToken(): 'ADMIN' | 'CUSTOMER' | null {
  if (typeof window === 'undefined') return null;

  const token = localStorage.getItem('authToken');
  if (!token) return null;

  const decoded = decodeToken(token);
  return decoded?.role ?? null;
}

/**
 * Verifica se o token está expirado
 * @returns true se expirado, false caso contrário
 */
export function isTokenExpired(): boolean {
  if (typeof window === 'undefined') return true;

  const token = localStorage.getItem('authToken');
  if (!token) return true;

  const decoded = decodeToken(token);
  if (!decoded?.exp) return true;

  // Comparar com o tempo atual em segundos
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp <= currentTime;
}

/**
 * Obtém todas as informações do usuário a partir do token
 * @returns Objeto com email, name e role, ou null se token inválido/expirado
 */
export function getUserFromToken() {
  if (typeof window === 'undefined') return null;

  const token = localStorage.getItem('authToken');
  if (!token) return null;

  if (isTokenExpired()) {
    // Token expirado, limpar localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    return null;
  }

  const decoded = decodeToken(token);
  if (!decoded?.sub || !decoded?.name || !decoded?.role) return null;

  return {
    email: decoded.sub,
    name: decoded.name,
    role: decoded.role as 'ADMIN' | 'CUSTOMER',
  };
}
