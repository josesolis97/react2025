
import React from 'react';
import { useAuth } from "../context/AuthContext";
import { Link } from 'react-router-dom';

export default function Header() {
  const { user, logout, getTotalItems } = useAuth();
  const totalItems = getTotalItems();

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold">Curso 25236- Tienda React Js</h1>
        <div className="flex items-center gap-4">
          <div>Carrito: <strong>{isNaN(totalItems) ? 0 : totalItems}</strong></div>
          {user ? (
            <div className="flex items-center gap-3">
              <span>Hola, {user.username}</span>
              <button
                onClick={logout} 
                className="bg-red-500 px-3 py-1 rounded"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <Link to="/login" className="underline">Iniciar sesión</Link>
          )}
        </div>
      </div>
    </header>
  );
}