import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function CustomerPanel() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const response = await fetch('https://68d5d2a1e29051d1c0afa80c.mockapi.io/api/v1/usuarios');
        const users = await response.json();
        const currentUser = users.find(u => u.username === user?.username);
        
        if (currentUser && currentUser.pedidos) {
          setOrders(currentUser.pedidos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)));
        }
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener pedidos:', error);
        setLoading(false);
      }
    };

    if (user) {
      fetchUserOrders();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="w-full p-4 lg:p-6 text-center">
        <h2 className="text-xl lg:text-2xl font-bold text-red-600">Acceso Denegado</h2>
        <p className="text-gray-600 mt-2 text-sm lg:text-base">Debes iniciar sesión para ver tus compras.</p>
      </div>
    );
  }

  if (loading) {
    return <p className="text-center p-4 lg:p-6 text-sm lg:text-base">Cargando...</p>;
  }

  return (
    <div className="w-full p-4 lg:p-6">
      <h1 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6">Mis Compras</h1>
      
      <div className="bg-white rounded shadow p-4 lg:p-6 mb-4 lg:mb-6">
        <h2 className="text-lg lg:text-xl font-semibold mb-2 lg:mb-4">Información del Cliente</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
          <div>
            <span className="text-gray-600 text-sm lg:text-base">Nombre:</span>
            <span className="ml-2 font-semibold text-sm lg:text-base">
              {user.nombre} {user.apellido}
            </span>
          </div>
          <div>
            <span className="text-gray-600 text-sm lg:text-base">Usuario:</span>
            <span className="ml-2 font-semibold text-sm lg:text-base">{user.username}</span>
          </div>
          <div>
            <span className="text-gray-600 text-sm lg:text-base">Email:</span>
            <span className="ml-2 font-semibold text-sm lg:text-base break-words">{user.email}</span>
          </div>
          <div>
            <span className="text-gray-600 text-sm lg:text-base">Rol:</span>
            <span className="ml-2 font-semibold text-sm lg:text-base">{user.rol}</span>
          </div>
          <div className="sm:col-span-2">
            <span className="text-gray-600 text-sm lg:text-base">Dirección:</span>
            <span className="ml-2 font-semibold text-sm lg:text-base">{user.direccion || 'No especificada'}</span>
          </div>
          <div className="sm:col-span-2">
            <span className="text-gray-600 text-sm lg:text-base">Teléfono:</span>
            <span className="ml-2 font-semibold text-sm lg:text-base">{user.telefono || 'No especificado'}</span>
          </div>
        </div>
      </div>

      <h2 className="text-lg lg:text-xl font-semibold mb-4">Historial de Compras</h2>
      
      {orders.length === 0 ? (
        <div className="bg-white p-4 lg:p-6 rounded shadow text-center">
          <p className="text-gray-500 text-sm lg:text-base">No has realizado compras aún.</p>
          <button
            onClick={() => window.location.href = '/products'}
            className="mt-4 text-blue-600 hover:underline text-sm lg:text-base"
          >
            ← Ir a comprar
          </button>
        </div>
      ) : (
        <div className="space-y-3 lg:space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded shadow p-4 lg:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                <div>
                  <h3 className="font-semibold text-base lg:text-lg">Pedido #{order.id}</h3>
                  <p className="text-gray-600 text-sm lg:text-base">
                    Fecha: {new Date(order.fecha).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg lg:text-2xl font-bold text-green-600">${order.total.toLocaleString()}</p>
                  <span className={`px-2 py-1 rounded text-xs ${
                    order.estado === 'completado' ? 'bg-green-100 text-green-800' :
                    order.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.estado || 'completado'}
                  </span>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3 text-sm lg:text-base">Productos Comprados:</h4>
                <div className="space-y-2">
                  {order.productos?.map((product, index) => (
                    <div key={`${order.id}-product-${index}`} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-gray-50 rounded gap-2">
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <img
                          src={product.imagen || 'https://via.placeholder.com/50'}
                          alt={product.nombre}
                          className="w-10 h-10 lg:w-12 lg:h-12 object-cover rounded flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-sm lg:text-base truncate">{product.nombre}</p>
                          <p className="text-xs lg:text-sm text-gray-600">${product.precio.toLocaleString()} c/u</p>
                        </div>
                      </div>
                      <div className="text-right sm:text-left w-full sm:w-auto">
                        <p className="font-semibold text-sm lg:text-base">x{product.cantidad}</p>
                        <p className="text-xs lg:text-sm text-gray-600">
                          ${(product.precio * product.cantidad).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )) || (
                    <p className="text-gray-500 text-sm lg:text-base">No hay detalles de productos</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
