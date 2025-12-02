import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AdminPanel() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showUserForm, setShowUserForm] = useState(false);

  const [userForm, setUserForm] = useState({
    username: '',
    password: '',
    email: '',
    nombre: '',
    apellido: '',
    rol: 'cliente',
    activo: true,
    direccion: '',
    telefono: ''
  });

  const [productForm, setProductForm] = useState({
    nombre: '',
    precio: '',
    stock: '',
    imagen: '',
    descripcion: '',
    categoria: 'Periféricos'
  });

  const fetchOrders = async () => {
    try {
      const response = await fetch('https://68d5d2a1e29051d1c0afa80c.mockapi.io/api/v1/usuarios');
      const users = await response.json();
      
      // Extraer todos los pedidos de todos los usuarios
      const allOrders = users.reduce((acc, user) => {
        if (user.pedidos && user.pedidos.length > 0) {
          const userOrders = user.pedidos.map(order => ({
            ...order,
            username: user.username,
            userNombre: user.nombre,
            userApellido: user.apellido,
            userEmail: user.email,
            userId: user.id
          }));
          return [...acc, ...userOrders];
        }
        return acc;
      }, []);
      
      setOrders(allOrders);
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
    }
  };

  const calculateTotalSales = (userId) => {
    const userOrders = orders.filter(order => order.userId === userId);
    return userOrders.reduce((total, order) => total + (order.total || 0), 0);
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://68d5d2a1e29051d1c0afa80c.mockapi.io/api/v1/usuarios');
      const users = await response.json();
      setUsers(users);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://68d5d2a1e29051d1c0afa80c.mockapi.io/api/v1/productos');
      const products = await response.json();
      setProducts(products);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchProducts(), fetchUsers(), fetchOrders()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingUser ? 'PUT' : 'POST';
      const url = editingUser 
        ? `https://68d5d2a1e29051d1c0afa80c.mockapi.io/api/v1/usuarios/${editingUser.id}`
        : 'https://68d5d2a1e29051d1c0afa80c.mockapi.io/api/v1/usuarios';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...userForm,
          pedidos: editingUser ? editingUser.pedidos : []
        })
      });

      if (response.ok) {
        await fetchUsers();
        setShowUserForm(false);
        setEditingUser(null);
        setUserForm({
          username: '',
          password: '',
          email: '',
          nombre: '',
          apellido: '',
          rol: 'cliente',
          activo: true,
          direccion: '',
          telefono: ''
        });
      }
    } catch (error) {
      console.error('Error al guardar usuario:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        await fetch(`https://68d5d2a1e29051d1c0afa80c.mockapi.io/api/v1/usuarios/${id}`, {
          method: 'DELETE'
        });
        await fetchUsers();
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
      }
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserForm({
      username: user.username,
      password: user.password,
      email: user.email,
      nombre: user.nombre || '',
      apellido: user.apellido || '',
      direccion: user.direccion,
      telefono: user.telefono,
      rol: user.rol,
      activo: user.activo
    });
    setShowUserForm(true);
  };

  const handleToggleUserStatus = async (user) => {
    try {
      await fetch(`https://68d5d2a1e29051d1c0afa80c.mockapi.io/api/v1/usuarios/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...user, activo: !user.activo })
      });
      await fetchUsers();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingProduct ? 'PUT' : 'POST';
      const url = editingProduct 
        ? `https://68d5d2a1e29051d1c0afa80c.mockapi.io/api/v1/productos/${editingProduct.id}`
        : 'https://68d5d2a1e29051d1c0afa80c.mockapi.io/api/v1/productos';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...productForm,
          precio: Number(productForm.precio),
          stock: Number(productForm.stock)
        })
      });

      if (response.ok) {
        await fetchProducts();
        setShowForm(false);
        setEditingProduct(null);
        setProductForm({
          nombre: '',
          precio: '',
          stock: '',
          imagen: '',
          descripcion: '',
          categoria: 'Periféricos'
        });
      }
    } catch (error) {
      console.error('Error al guardar producto:', error);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await fetch(`https://68d5d2a1e29051d1c0afa80c.mockapi.io/api/v1/productos/${id}`, {
          method: 'DELETE'
        });
        await fetchProducts();
      } catch (error) {
        console.error('Error al eliminar producto:', error);
      }
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      nombre: product.nombre,
      precio: product.precio,
      stock: product.stock,
      imagen: product.imagen,
      descripcion: product.descripcion,
      categoria: product.categoria
    });
    setShowForm(true);
  };

    if (user?.rol !== 'admin') {
    return (
      <div className="container mt-4">
        <div className="row">
          <div className="col-12 text-center">
            <h2 className="text-danger">Acceso Denegado</h2>
            <p className="text-muted">No tienes permisos para acceder al panel de administración.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return <p className="text-center mt-4">Cargando...</p>;
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h1 className="display-5 fw-bold mb-4">Panel de Administración</h1>
          
          <div className="btn-group flex-wrap mb-4" role="group">
            <button
              key="products-tab"
              onClick={() => setActiveTab('products')}
              className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-outline-primary'}`}
            >
              Productos ({products.length})
            </button>
            <button
              key="users-tab"
              onClick={() => setActiveTab('users')}
              className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-outline-primary'}`}
            >
              Usuarios ({users.length})
            </button>
            <button
              key="orders-tab"
              onClick={() => setActiveTab('orders')}
              className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-outline-primary'}`}
            >
              Pedidos ({orders.length})
            </button>
          </div>

      {activeTab === 'products' && (
        <div>
          <div className="d-flex justify-content-between align-items-start align-items-md-center mb-4 flex-column flex-md-row gap-2">
            <h2 className="h4 fw-semibold">Gestión de Productos</h2>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingProduct(null);
                setProductForm({
                  nombre: '',
                  precio: '',
                  stock: '',
                  imagen: '',
                  descripcion: '',
                  categoria: 'Periféricos'
                });
              }}
              className="btn btn-success w-100 w-md-auto"
            >
              Agregar Producto
            </button>
          </div>

          {showForm && (
            <div className="card mb-4">
              <div className="card-body">
                <h3 className="card-title h5 fw-semibold mb-4">
                  {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                </h3>
                <form onSubmit={handleProductSubmit}>
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <input
                        type="text"
                        placeholder="Nombre"
                        value={productForm.nombre}
                        onChange={(e) => setProductForm({...productForm, nombre: e.target.value})}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <input
                        type="number"
                        placeholder="Precio"
                        value={productForm.precio}
                        onChange={(e) => setProductForm({...productForm, precio: e.target.value})}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <input
                        type="number"
                        placeholder="Stock"
                        value={productForm.stock}
                        onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <input
                        type="url"
                        placeholder="URL Imagen"
                        value={productForm.imagen}
                        onChange={(e) => setProductForm({...productForm, imagen: e.target.value})}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <select
                        value={productForm.categoria}
                        onChange={(e) => setProductForm({...productForm, categoria: e.target.value})}
                        className="form-select"
                      >
                        <option key="perifericos" value="Periféricos">Periféricos</option>
                        <option key="monitores" value="Monitores">Monitores</option>
                        <option key="almacenamiento" value="Almacenamiento">Almacenamiento</option>
                        <option key="computadoras" value="Computadoras">Computadoras</option>
                        <option key="audio" value="Audio">Audio</option>
                        <option key="accesorios" value="Accesorios">Accesorios</option>
                        <option key="oficina" value="Oficina">Oficina</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <textarea
                        placeholder="Descripción"
                        value={productForm.descripcion}
                        onChange={(e) => setProductForm({...productForm, descripcion: e.target.value})}
                        className="form-control"
                        rows="3"
                        required
                      />
                    </div>
                    <div className="col-12">
                      <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary">
                          {editingProduct ? 'Actualizar' : 'Guardar'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowForm(false)}
                          className="btn btn-secondary"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="card">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr key="products-header">
                      <th>Producto</th>
                      <th className="d-none d-sm-table-cell">Categoría</th>
                      <th className="d-none d-md-table-cell">Precio</th>
                      <th className="d-none d-lg-table-cell">Stock</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <img
                              src={product.imagen}
                              alt={product.nombre}
                              className="img-fluid rounded"
                              style={{width: '50px', height: '50px', objectFit: 'cover'}}
                            />
                            <div>
                              <div key={`nombre-${product.id}`} className="fw-semibold text-truncate" style={{maxWidth: '200px'}}>{product.nombre}</div>
                              <div key={`descripcion-${product.id}`} className="text-muted small d-none d-sm-block text-truncate" style={{maxWidth: '200px'}}>{product.descripcion}</div>
                              <div className="d-sm-none text-muted small">${product.precio.toLocaleString()} | Stock: {product.stock}</div>
                            </div>
                          </div>
                        </td>
                        <td className="d-none d-sm-table-cell">{product.categoria}</td>
                        <td className="d-none d-md-table-cell">${product.precio.toLocaleString()}</td>
                        <td className="d-none d-lg-table-cell">{product.stock}</td>
                        <td>
                          <div className="d-flex flex-column flex-sm-row gap-1">
                            <button
                              key={`edit-${product.id}`}
                              onClick={() => handleEditProduct(product)}
                              className="btn btn-sm btn-outline-primary"
                            >
                              Editar
                            </button>
                            <button
                              key={`delete-${product.id}`}
                              onClick={() => handleDeleteProduct(product.id)}
                              className="btn btn-sm btn-outline-danger"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div>
          <div className="d-flex justify-content-between align-items-start align-items-md-center mb-4 flex-column flex-md-row gap-2">
            <h2 className="h4 fw-semibold">Gestión de Usuarios</h2>
            <button
              onClick={() => {
                setShowUserForm(true);
                setEditingUser(null);
                setUserForm({
                  username: '',
                  password: '',
                  email: '',
                  nombre: '',
                  apellido: '',
                  rol: 'cliente',
                  activo: true,
                  direccion: '',
                  telefono: ''
                });
              }}
              className="btn btn-success w-100 w-md-auto"
            >
              Agregar Usuario
            </button>
          </div>

          {showUserForm && (
            <div className="card mb-4">
              <div className="card-body">
                <h3 className="card-title h5 fw-semibold mb-4">
                  {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                </h3>
                <form onSubmit={handleUserSubmit}>
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <input
                        type="text"
                        placeholder="Nombre"
                        value={userForm.nombre}
                        onChange={(e) => setUserForm({...userForm, nombre: e.target.value})}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <input
                        type="text"
                        placeholder="Apellido"
                        value={userForm.apellido}
                        onChange={(e) => setUserForm({...userForm, apellido: e.target.value})}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <input
                        type="text"
                        placeholder="Nombre de usuario"
                        value={userForm.username}
                        onChange={(e) => setUserForm({...userForm, username: e.target.value})}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <input
                        type="email"
                        placeholder="Email"
                        value={userForm.email}
                        onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <input
                        type="password"
                        placeholder="Contraseña"
                        value={userForm.password}
                        onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                        className="form-control"
                        required
                        minLength="4"
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <input
                        type="tel"
                        placeholder="Teléfono"
                        value={userForm.telefono}
                        onChange={(e) => setUserForm({...userForm, telefono: e.target.value})}
                        className="form-control"
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <input
                        type="text"
                        placeholder="Dirección"
                        value={userForm.direccion}
                        onChange={(e) => setUserForm({...userForm, direccion: e.target.value})}
                        className="form-control"
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <select
                        value={userForm.rol}
                        onChange={(e) => setUserForm({...userForm, rol: e.target.value})}
                        className="form-select"
                      >
                        <option key="cliente" value="cliente">Cliente</option>
                        <option key="admin" value="admin">Administrador</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          id="activo"
                          checked={userForm.activo}
                          onChange={(e) => setUserForm({...userForm, activo: e.target.checked})}
                          className="form-check-input"
                        />
                        <label htmlFor="activo" className="form-check-label">Usuario activo</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary">
                          {editingUser ? 'Actualizar' : 'Guardar'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowUserForm(false)}
                          className="btn btn-secondary"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="card">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr key="users-header">
                      <th>Nombre</th>
                      <th className="d-none d-sm-table-cell">Usuario</th>
                      <th className="d-none d-md-table-cell">Email</th>
                      <th className="d-none d-lg-table-cell">Rol</th>
                      <th>Estado</th>
                      <th className="d-none d-xl-table-cell">Ventas</th>
                      <th className="d-none d-xxl-table-cell">Contacto</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className="fw-semibold text-truncate" style={{maxWidth: '150px'}}>
                            {user.nombre && user.apellido ? `${user.nombre} ${user.apellido}` : user.username}
                          </div>
                          <div className="d-sm-none text-muted small">
                            @{user.username}
                          </div>
                        </td>
                        <td className="d-none d-sm-table-cell text-muted">{user.username}</td>
                        <td className="d-none d-md-table-cell">
                          <div className="text-truncate" style={{maxWidth: '200px'}}>{user.email}</div>
                        </td>
                        <td className="d-none d-lg-table-cell">
                          <span className={`badge ${
                            user.rol === 'admin' ? 'bg-purple text-white' : 'bg-primary'
                          }`}>
                            {user.rol}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => handleToggleUserStatus(user)}
                            className={`btn btn-sm ${
                              user.activo ? 'btn-success' : 'btn-danger'
                            }`}
                          >
                            {user.activo ? 'Activo' : 'Inactivo'}
                          </button>
                        </td>
                        <td className="d-none d-xl-table-cell">
                          <span className="fw-semibold text-success">
                            ${calculateTotalSales(user.id).toLocaleString()}
                          </span>
                        </td>
                        <td className="d-none d-xxl-table-cell text-muted small">
                          <div className="text-truncate" style={{maxWidth: '150px'}}>{user.direccion}</div>
                          <div className="text-truncate" style={{maxWidth: '150px'}}>{user.telefono}</div>
                        </td>
                        <td>
                          <div className="d-flex flex-column flex-sm-row gap-1">
                            <button
                              key={`edit-${user.id}`}
                              onClick={() => handleEditUser(user)}
                              className="btn btn-sm btn-outline-primary"
                            >
                              Editar
                            </button>
                            {user.username !== 'admin' && (
                              <button
                                key={`delete-${user.id}`}
                                onClick={() => handleDeleteUser(user.id)}
                                className="btn btn-sm btn-outline-danger"
                              >
                                Eliminar
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div>
          <h2 className="h4 fw-semibold mb-4">Gestión de Pedidos</h2>
          {orders.length === 0 ? (
            <div className="card">
              <div className="card-body text-center">
                <p className="text-muted">No hay pedidos registrados</p>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr key="orders-header">
                        <th>ID</th>
                        <th>Cliente</th>
                        <th className="d-none d-sm-table-cell">Fecha</th>
                        <th className="d-none d-md-table-cell">Total</th>
                        <th>Estado</th>
                        <th className="d-none d-lg-table-cell">Productos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={`${order.userId}-${order.id}`}>
                          <td className="font-monospace small">#{order.id}</td>
                          <td>
                            <div key={`customer-${order.userId}`}>
                              <div className="fw-semibold text-truncate" style={{maxWidth: '150px'}}>
                                {order.userNombre && order.userApellido ? 
                                  `${order.userNombre} ${order.userApellido}` : 
                                  order.username
                                }
                              </div>
                              <div className="text-muted small">@{order.username}</div>
                              <div className="text-muted small d-none d-sm-block text-truncate" style={{maxWidth: '200px'}}>{order.userEmail}</div>
                              <div className="d-sm-none text-muted small">
                                ${order.total.toLocaleString()}
                              </div>
                            </div>
                          </td>
                          <td className="d-none d-sm-table-cell">{new Date(order.fecha).toLocaleDateString()}</td>
                          <td className="d-none d-md-table-cell fw-semibold">${order.total.toLocaleString()}</td>
                          <td>
                            <span className={`badge ${
                              order.estado === 'completado' ? 'bg-success text-white' :
                              order.estado === 'pendiente' ? 'bg-warning text-dark' :
                              'bg-secondary text-white'
                            }`}>
                              {order.estado || 'pendiente'}
                            </span>
                          </td>
                          <td className="d-none d-lg-table-cell">
                            <div key={`products-${order.id}`} className="small">
                              {order.productos?.map((product, index) => (
                                <div key={`${order.id}-product-${index}`} className="mb-1">
                                  {product.nombre} x{product.cantidad}
                                </div>
                              )) || 'Sin productos'}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
        </div>
      </div>
    </div>
  );
}
