import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const { cart, removeFromCart, clearCart, getTotalItems, getTotalPrice } = useAuth();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Carrito</h2>
        <p className="text-gray-600">Tu carrito está vacío.</p>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 text-blue-600 hover:underline"
        >
          ← Seguir comprando
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Carrito ({getTotalItems()} productos)</h2>

      <div className="space-y-4 mb-6">
        {cart.map((item) => (
          <div key={item.id} className="flex items-center border p-4 rounded shadow">
            <img
              src={item.image || item.imageUrl}
              alt={item.name}
              className="w-16 h-16 object-cover rounded mr-4"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-gray-600">${item.price.toLocaleString()} x {item.quantity}</p>
            </div>
            <div className="font-bold">${(item.price * item.quantity).toLocaleString()}</div>
            <button
              onClick={() => removeFromCart(item.id)}
              className="ml-4 text-red-600 hover:text-red-800"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 flex justify-between items-center">
        <div>
          <p className="text-lg font-bold">Total: ${getTotalPrice().toLocaleString()}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={clearCart}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Vaciar carrito
          </button>
          <button
            onClick={() => navigate('/products')}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Seguir comprando
          </button>
          <button
            onClick={() => alert('¡Compra finalizada!')}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Finalizar compra
          </button>
        </div>
      </div>
    </div>
  );
}