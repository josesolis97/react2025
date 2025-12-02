import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function CustomerPanel() {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const response = await fetch('https://68d5d2a1e29051d1c0afa80c.mockapi.io/api/v1/usuarios');
        const users = await response.json();
        const currentUser = users.find(u => u.username === user?.username);
        
        if (currentUser && currentUser.pedidos) {
          setOrders(currentUser.pedidos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)));
        }
        setOrdersLoading(false);
      } catch (error) {
        setOrdersLoading(false);
      }
    };

    if (user) {
      fetchUserOrders();
    }
  }, [user]);

  if (loading) {
    return <div className="text-center mt-4">Cargando autenticación...</div>;
  }

  if (!user) {
    return (
      <div className="container mt-4">
        <div className="row">
          <div className="col-12 text-center">
            <h2 className="text-danger">Acceso Denegado</h2>
            <p className="text-muted">Debes iniciar sesión para ver tus compras.</p>
          </div>
        </div>
      </div>
    );
  }

  if (ordersLoading) {
    return <p className="text-center mt-4">Cargando pedidos...</p>;
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h1 className="display-5 fw-bold mb-4">Mis Compras</h1>
          
          <div className="card mb-4">
            <div className="card-body">
              <h2 className="card-title h5 fw-semibold mb-3">Información del Cliente</h2>
              <div className="row g-3">
                <div className="col-12 col-sm-6">
                  <div>
                    <span className="text-muted">Nombre:</span>
                    <span className="ms-2 fw-semibold">
                      {user.nombre} {user.apellido}
                    </span>
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <div>
                    <span className="text-muted">Usuario:</span>
                    <span className="ms-2 fw-semibold">{user.username}</span>
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <div>
                    <span className="text-muted">Email:</span>
                    <span className="ms-2 fw-semibold d-inline-block text-truncate" style={{maxWidth: '200px'}}>{user.email}</span>
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <div>
                    <span className="text-muted">Rol:</span>
                    <span className="ms-2 fw-semibold">{user.rol}</span>
                  </div>
                </div>
                <div className="col-12">
                  <div>
                    <span className="text-muted">Dirección:</span>
                    <span className="ms-2 fw-semibold">{user.direccion || 'No especificada'}</span>
                  </div>
                </div>
                <div className="col-12">
                  <div>
                    <span className="text-muted">Teléfono:</span>
                    <span className="ms-2 fw-semibold">{user.telefono || 'No especificado'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h2 className="h4 fw-semibold mb-4">Historial de Compras</h2>
          
          {orders.length === 0 ? (
            <div className="card">
              <div className="card-body text-center">
                <p className="text-muted">No has realizado compras aún.</p>
                <button
                  onClick={() => window.location.href = '/products'}
                  className="btn btn-link mt-3"
                >
                  ← Ir a comprar
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start align-items-md-center mb-3 flex-column flex-md-row gap-2">
                      <div>
                        <h3 className="card-title h6 fw-semibold mb-1">Pedido #{order.id}</h3>
                        <p className="card-text text-muted small mb-0">
                          Fecha: {new Date(order.fecha).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="text-end">
                        <p className="h4 fw-bold text-success mb-2">${order.total.toLocaleString()}</p>
                        <span className={`badge ${
                          order.estado === 'completado' ? 'bg-success text-white' :
                          order.estado === 'pendiente' ? 'bg-warning text-dark' :
                          'bg-secondary text-white'
                        }`}>
                          {order.estado || 'completado'}
                        </span>
                      </div>
                    </div>
                    
                    <hr className="my-3" />
                    
                    <h4 className="h6 fw-semibold mb-3">Productos Comprados:</h4>
                    <div className="space-y-2">
                      {order.productos?.map((product, index) => (
                        <div key={`${order.id}-product-${index}`} className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                          <div className="d-flex align-items-center gap-3 flex-grow-1">
                            <img
                              src={product.imagen || 'https://via.placeholder.com/50'}
                              alt={product.nombre}
                              className="img-fluid rounded flex-shrink-0"
                              style={{width: '50px', height: '50px', objectFit: 'cover'}}
                            />
                            <div className="flex-grow-1 min-w-0">
                              <p className="fw-semibold mb-1 text-truncate">{product.nombre}</p>
                              <p className="text-muted small mb-0">${product.precio.toLocaleString()} c/u</p>
                            </div>
                          </div>
                          <div className="text-end ms-3">
                            <p className="fw-semibold mb-1">x{product.cantidad}</p>
                            <p className="text-muted small mb-0">
                              ${(product.precio * product.cantidad).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )) || (
                        <p className="text-muted">No hay detalles de productos</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
