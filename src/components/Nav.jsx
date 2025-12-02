import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Nav() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <nav className="bg-gray-100 border-b sticky top-16 sm:top-auto z-40">
      <div className="container mx-auto px-2 sm:px-4">
        {/* Navegación Desktop */}
        <div className="hidden sm:flex items-center justify-between py-3">
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
            <Link 
              to="/products" 
              className="text-blue-700 hover:text-blue-800 font-medium transition-colors active:scale-95"
            >
              Productos
            </Link>
            <Link 
              to="/cart" 
              className="text-blue-700 hover:text-blue-800 font-medium transition-colors active:scale-95"
            >
              Carrito
            </Link>
            {user?.rol === 'admin' && (
              <Link 
                to="/admin" 
                className="text-purple-700 hover:text-purple-800 font-semibold transition-colors active:scale-95"
              >
                Admin
              </Link>
            )}
            {user?.rol === 'cliente' && (
              <Link 
                to="/customer" 
                className="text-green-700 hover:text-green-800 font-semibold transition-colors active:scale-95"
              >
                Mis Compras
              </Link>
            )}
            {!user && (
              <Link 
                to="/register" 
                className="text-green-700 hover:text-green-800 font-semibold transition-colors active:scale-95"
              >
                Registrarse
              </Link>
            )}
          </div>
        </div>

        {/* Navegación Móvil */}
        <div className="sm:hidden">
          {/* Botón de menú móvil */}
          <div className="flex items-center justify-between py-3">
            <span className="text-gray-600 font-medium">Menú</span>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md hover:bg-gray-200 transition-colors active:scale-95"
              aria-label="Menú de Navegación"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                )}
              </svg>
            </button>
          </div>

          {/* Items del menú móvil */}
          {mobileMenuOpen && (
            <div className="py-3 border-t border-gray-300">
              <div className="flex flex-col gap-2">
                <Link 
                  to="/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors active:scale-95"
                >
                  <span className="font-medium">Productos</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                
                <Link 
                  to="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors active:scale-95"
                >
                  <span className="font-medium">Carrito</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                
                {user?.rol === 'admin' && (
                  <Link 
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-3 text-purple-700 hover:bg-purple-50 rounded-lg transition-colors active:scale-95"
                  >
                    <span className="font-semibold">Admin</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
                
                {user?.rol === 'cliente' && (
                  <Link 
                    to="/customer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-3 text-green-700 hover:bg-green-50 rounded-lg transition-colors active:scale-95"
                  >
                    <span className="font-semibold">Mis Compras</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
                
                {!user && (
                  <Link 
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-3 text-green-700 hover:bg-green-50 rounded-lg transition-colors active:scale-95"
                  >
                    <span className="font-semibold">Registrarse</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
