
import React, { useState } from 'react';
import { useAuth } from "../context/AuthContext";
import { Link } from 'react-router-dom';

export default function Header() {
  const { user, logout, getTotalItems } = useAuth();
  const totalItems = getTotalItems();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-16 sm:h-auto py-2 sm:py-4">
          {/* Logo/Title */}
          <div className="flex items-center">
            <h1 className="text-lg sm:text-xl font-bold line-clamp-2">
              <span className="hidden sm:inline">Curso 25236- </span>Tienda React Js
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-3 sm:gap-4">
            <div className="text-sm sm:text-base">
              Carrito: <strong className="text-yellow-300">{isNaN(totalItems) ? 0 : totalItems}</strong>
            </div>
            {user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-sm sm:text-base hidden md:inline">Hola, {user.nombre}</span>
                <span className="text-sm sm:text-base md:hidden">{user.nombre}</span>
                <button
                  onClick={logout} 
                  className="bg-red-500 hover:bg-red-600 px-3 py-1.5 sm:py-2 rounded text-sm sm:text-base transition-colors active:scale-95"
                >
                  <span className="hidden sm:inline">Cerrar sesión</span>
                  <span className="sm:hidden">Salir</span>
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="bg-white text-blue-600 hover:bg-gray-100 px-3 py-1.5 sm:py-2 rounded text-sm sm:text-base font-medium transition-colors active:scale-95"
              >
                Iniciar sesión
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md hover:bg-blue-700 transition-colors active:scale-95"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden py-4 border-t border-blue-500">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-base">Carrito: <strong className="text-yellow-300">{isNaN(totalItems) ? 0 : totalItems}</strong></span>
              </div>
              {user ? (
                <div className="flex flex-col gap-3">
                  <div className="text-base py-2 border-b border-blue-500">
                    Hola, {user.nombre}
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }} 
                    className="bg-red-500 hover:bg-red-600 px-4 py-3 rounded text-base font-medium transition-colors text-center"
                  >
                    Cerrar sesión
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-3 rounded text-base font-medium transition-colors text-center"
                >
                  Iniciar sesión
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}