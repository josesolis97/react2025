import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const { cart, removeFromCart, clearCart, getTotalItems, getTotalPrice, user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      // 1. Actualizar stock de productos
      for (const item of cart) {
        console.log('Procesando producto:', item);
        const productResponse = await fetch(`https://68d5d2a1e29051d1c0afa80c.mockapi.io/api/v1/productos/${item.id}`);
        const product = await productResponse.json();
        
        console.log('Producto encontrado:', product);
        const itemCantidad = item.cantidad || item.quantity;
        const newStock = product.stock - itemCantidad;
        
        console.log(`Stock actual: ${product.stock}, Cantidad: ${itemCantidad}, Nuevo stock: ${newStock}`);
        
        if (newStock < 0) {
          alert(`No hay suficiente stock para ${item.nombre || item.name}. Stock disponible: ${product.stock}`);
          return;
        }

        await fetch(`https://68d5d2a1e29051d1c0afa80c.mockapi.io/api/v1/productos/${item.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...product, stock: newStock })
        });
        
        console.log(`Stock actualizado para producto ${item.id}: ${newStock}`);
        
        // Verificar que se actualizó correctamente
        const verifyResponse = await fetch(`https://68d5d2a1e29051d1c0afa80c.mockapi.io/api/v1/productos/${item.id}`);
        const verifyProduct = await verifyResponse.json();
        console.log('Verificación de stock actualizado:', verifyProduct.stock);
      }

      // 2. Crear pedido
      const newOrder = {
        id: Date.now().toString(),
        fecha: new Date().toISOString(),
        total: getTotalPrice(),
        estado: 'completado',
        productos: cart.map(item => ({
          id: item.id,
          nombre: item.nombre || item.name,
          cantidad: item.cantidad || item.quantity,
          precio: item.precio || item.price,
          imagen: item.imagen || item.image || item.imageUrl
        }))
      };

      // 3. Obtener usuario actual y agregar pedido
      const usersResponse = await fetch('https://68d5d2a1e29051d1c0afa80c.mockapi.io/api/v1/usuarios');
      const users = await usersResponse.json();
      const currentUser = users.find(u => u.username === user.username);
      
      console.log('Usuario logueado:', user);
      console.log('Usuarios encontrados:', users);
      console.log('Usuario encontrado:', currentUser);
      console.log('ID del usuario encontrado:', currentUser?.id);
      console.log('Keys del usuario encontrado:', Object.keys(currentUser || {}));
      console.log('Usuario completo:', JSON.stringify(currentUser, null, 2));
      
      if (currentUser && currentUser.id) {
        const pedidos = currentUser.pedidos || [];
        pedidos.push(newOrder);
        
        await fetch(`https://68d5d2a1e29051d1c0afa80c.mockapi.io/api/v1/usuarios/${currentUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...currentUser, pedidos })
        });
        
        console.log('Pedido guardado exitosamente');
        console.log('Pedidos actualizados:', pedidos);
        
        // Verificar que el pedido se guardó
        const verifyUserResponse = await fetch(`https://68d5d2a1e29051d1c0afa80c.mockapi.io/api/v1/usuarios/${currentUser.id}`);
        const verifyUser = await verifyUserResponse.json();
        console.log('Verificación de pedidos guardados:', verifyUser.pedidos);
      } else {
        throw new Error('Usuario no encontrado o sin ID válido');
      }

      // 4. Limpiar carrito y mostrar éxito
      clearCart();
      alert('¡Compra finalizada con éxito! Stock actualizado.');
      
      // 5. Refrescar productos para mostrar stock actualizado
      window.location.reload(); // O mejor: usar un callback para refrescar productos
      
      navigate('/customer');
    } catch (error) {
      console.error('Error en checkout:', error);
      alert('Error al procesar la compra. Por favor intenta nuevamente.');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mt-4">
        <div className="row">
          <div className="col-12">
            <h2 className="display-6 fw-bold mb-4">Carrito</h2>
            <div className="card">
              <div className="card-body text-center">
                <p className="text-muted mb-4">Tu carrito está vacío.</p>
                <button
                  onClick={() => navigate('/products')}
                  className="btn btn-primary"
                >
                  ← Seguir comprando
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h2 className="display-6 fw-bold mb-4">Carrito ({getTotalItems()} productos)</h2>

          <div className="space-y-3 mb-4">
            {cart.map((item) => (
              <div key={item.id} className="card">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-12 col-sm-auto mb-3 mb-sm-0">
                      <img
                        src={item.imagen || item.image || item.imageUrl}
                        alt={item.nombre || item.name}
                        className="img-fluid rounded"
                        style={{width: '80px', height: '80px', objectFit: 'cover'}}
                      />
                    </div>
                    <div className="col-12 col-sm">
                      <h5 className="card-title mb-2">{item.nombre || item.name}</h5>
                      <p className="card-text text-muted">
                        ${(item.precio || item.price).toLocaleString()} x {item.cantidad || item.quantity}
                      </p>
                    </div>
                    <div className="col-12 col-sm-auto">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="fw-bold fs-5 me-3">
                          ${((item.precio || item.price) * (item.cantidad || item.quantity)).toLocaleString()}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="btn btn-sm btn-outline-danger"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-12 col-md">
                  <h4 className="fw-bold mb-3 mb-md-0">Total: ${getTotalPrice().toLocaleString()}</h4>
                </div>
                <div className="col-12 col-md-auto">
                  <div className="d-flex flex-column flex-sm-row gap-2">
                    <button
                      onClick={clearCart}
                      className="btn btn-danger"
                    >
                      Vaciar carrito
                    </button>
                    <button
                      onClick={() => navigate('/products')}
                      className="btn btn-secondary"
                    >
                      Seguir comprando
                    </button>
                    <button
                      onClick={handleCheckout}
                      className="btn btn-success"
                    >
                      {user ? "Finalizar compra" : "Iniciar sesión para comprar"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}