'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getUserFromToken } from '@/lib/jwt-utils';
import Link from 'next/link';

interface UserInfo {
  email: string;
  name: string;
  role: 'ADMIN' | 'CUSTOMER';
}

export function Header() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadUser = () => {
      const userInfo = getUserFromToken();
      setUser(userInfo);
      setIsLoading(false);
    };

    loadUser();

    // Atualizar a cada 10 segundos para verificar se token expirou
    const interval = setInterval(loadUser, 10000);

    return () => clearInterval(interval);
  }, []);

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    setUser(null);
    setShowMenu(false);
    router.push('/auth');
  };

  const isAdmin = user?.role === 'ADMIN';
  const dashboardUrl = isAdmin ? '/dashboard-admin' : '/dashboard-user';

  if (isLoading) {
    return (
      <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center h-8">
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </header>
    );
  }

  if (!user) {
    return (
      <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto grid grid-cols-3 items-center">
          {/* Logo */}
          <Link href="/" className="font-bold text-lg text-gray-900 hover:opacity-80 transition">
            Arena.pe
          </Link>

          {/* Nav — centralizado */}
          <nav className="flex items-center justify-center gap-6">
            <Link href="/event-discover" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Eventos
            </Link>
            <a href="/about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Sobre
            </a>
          </nav>

          {/* Auth buttons */}
          <div className="flex items-center justify-end gap-3">
            <Link href="/auth?tab=register" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Cadastre-se
            </Link>
            <Link href="/auth?tab=login" className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2 rounded-lg transition-colors">
              Entrar
            </Link>
          </div>
        </div>
      </header>
    );
  }

  const roleLabel = isAdmin ? 'Administrador' : 'Cliente';
  const roleBgColor = isAdmin ? 'bg-blue-100' : 'bg-green-100';
  const roleBadgeColor = isAdmin ? 'text-blue-800' : 'text-green-800';

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto grid grid-cols-3 items-center">
        {/* Logo */}
        <Link href="/" className="font-bold text-lg text-gray-900 hover:opacity-80 transition">
          Arena.pe
        </Link>

        {/* Nav — centralizado */}
        <nav className="flex items-center justify-center gap-6">
          <Link href="/event-discover" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Eventos
          </Link>
          <a href="about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Sobre
          </a>
        </nav>

        {/* User Menu */}
        <div className="flex items-center justify-end">
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg transition"
            >
              {/* Avatar com iniciais */}
              <div className={`w-9 h-9 rounded-full ${roleBgColor} flex items-center justify-center font-semibold text-sm ${roleBadgeColor}`}>
                {user.name
                  .split(' ')
                  .slice(0, 2)
                  .map((n) => n[0].toUpperCase())
                  .join('')}
              </div>

              {/* Nome e Role */}
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold text-gray-900">{user.name}</p>
                <p className={`text-xs ${roleBadgeColor}`}>{roleLabel}</p>
              </div>

              {/* Ícone de chevron */}
              <svg
                className={`w-4 h-4 text-gray-600 transition-transform ${showMenu ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </button>

            {/* Menu Dropdown */}
            {showMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                {/* Informações do usuário */}
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-600 truncate">{user.email}</p>
                  <div className="mt-2">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${roleBgColor} ${roleBadgeColor}`}>
                      {roleLabel}
                    </span>
                  </div>
                </div>

                {/* Links do menu */}
                <Link
                  href={dashboardUrl}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                  onClick={() => setShowMenu(false)}
                >
                  Dashboard
                </Link>

                {isAdmin && (
                  <Link
                    href="/events/register"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                    onClick={() => setShowMenu(false)}
                  >
                    Criar Evento
                  </Link>
                )}

                {/* Logout */}
                <div className="border-t border-gray-200 pt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition font-medium"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
