import React from "react";

import { Link } from "react-router-dom";

export default function Nav() {
  return (
    <nav className="bg-gray-100 p-3 border-b">
      <div className="container mx-auto flex gap-6">
        <Link to="/" className="text-blue-700">Inicio</Link>
        <Link to="/products" className="text-blue-700">Productos</Link>
        <Link to="/cart" className="text-blue-700">Carrito</Link>
      </div>
    </nav>
  );
}
