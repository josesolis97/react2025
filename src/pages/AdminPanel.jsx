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
      <div className="w-full p-4 lg:p-6 text-center">
        <h2 className="text-xl lg:text-2xl font-bold text-red-600">Acceso Denegado</h2>
        <p className="text-gray-600 mt-2 text-sm lg:text-base">No tienes permisos para acceder al panel de administración.</p>
      </div>
    );
  }

  if (loading) {
    return <p className="text-center p-4 lg:p-6 text-sm lg:text-base">Cargando...</p>;
  }

  return (
    <div className="w-full p-4 lg:p-6">
      <h1 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6">Panel de Administración</h1>
      
      <div className="flex flex-wrap gap-2 mb-4 lg:mb-6">
        <button
          key="products-tab"
          onClick={() => setActiveTab('products')}
          className={`px-3 py-2 lg:px-4 rounded text-sm lg:text-base ${activeTab === 'products' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Productos ({products.length})
        </button>
        <button
          key="users-tab"
          onClick={() => setActiveTab('users')}
          className={`px-3 py-2 lg:px-4 rounded text-sm lg:text-base ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Usuarios ({users.length})
        </button>
        <button
          key="orders-tab"
          onClick={() => setActiveTab('orders')}
          className={`px-3 py-2 lg:px-4 rounded text-sm lg:text-base ${activeTab === 'orders' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Pedidos ({orders.length})
        </button>
      </div>

      {activeTab === 'products' && (
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <h2 className="text-lg lg:text-xl font-semibold">Gestión de Productos</h2>
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
              className="bg-green-600 text-white px-3 py-2 lg:px-4 rounded hover:bg-green-700 text-sm lg:text-base w-full sm:w-auto"
            >
              Agregar Producto
            </button>
          </div>

          {showForm && (
            <div className="bg-white p-6 rounded shadow mb-6">
              <h3 className="text-lg font-semibold mb-4">
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </h3>
              <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nombre"
                  value={productForm.nombre}
                  onChange={(e) => setProductForm({...productForm, nombre: e.target.value})}
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="number"
                  placeholder="Precio"
                  value={productForm.precio}
                  onChange={(e) => setProductForm({...productForm, precio: e.target.value})}
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={productForm.stock}
                  onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="url"
                  placeholder="URL Imagen"
                  value={productForm.imagen}
                  onChange={(e) => setProductForm({...productForm, imagen: e.target.value})}
                  className="border p-2 rounded"
                  required
                />
                <select
                  value={productForm.categoria}
                  onChange={(e) => setProductForm({...productForm, categoria: e.target.value})}
                  className="border p-2 rounded"
                >
                  <option key="perifericos" value="Periféricos">Periféricos</option>
                  <option key="monitores" value="Monitores">Monitores</option>
                  <option key="almacenamiento" value="Almacenamiento">Almacenamiento</option>
                  <option key="computadoras" value="Computadoras">Computadoras</option>
                  <option key="audio" value="Audio">Audio</option>
                  <option key="accesorios" value="Accesorios">Accesorios</option>
                  <option key="oficina" value="Oficina">Oficina</option>
                </select>
                <textarea
                  placeholder="Descripción"
                  value={productForm.descripcion}
                  onChange={(e) => setProductForm({...productForm, descripcion: e.target.value})}
                  className="border p-2 rounded md:col-span-2"
                  rows="3"
                  required
                />
                <div className="md:col-span-2 flex gap-2">
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    {editingProduct ? 'Actualizar' : 'Guardar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white p-4 lg:p-6 rounded shadow mb-4 lg:mb-6 overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-100">
                  <tr key="products-header">
                    <th className="p-2 lg:p-3 text-left text-xs lg:text-sm">Producto</th>
                    <th className="p-2 lg:p-3 text-left text-xs lg:text-sm hidden sm:table-cell">Categoría</th>
                    <th className="p-2 lg:p-3 text-left text-xs lg:text-sm hidden md:table-cell">Precio</th>
                    <th className="p-2 lg:p-3 text-left text-xs lg:text-sm hidden lg:table-cell">Stock</th>
                    <th className="p-2 lg:p-3 text-left text-xs lg:text-sm">Acciones</th>
                  </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-t">
                    <td className="p-2 lg:p-3">
                      <div className="flex items-center gap-2 lg:gap-3">
                        <img
                          src={product.imagen}
                          alt={product.nombre}
                          className="w-10 h-10 lg:w-12 lg:h-12 object-cover rounded"
                        />
                        <div className="min-w-0">
                          <div key={`nombre-${product.id}`} className="font-semibold text-sm lg:text-base truncate">{product.nombre}</div>
                          <div key={`descripcion-${product.id}`} className="text-xs lg:text-sm text-gray-600 hidden sm:block truncate">{product.descripcion}</div>
                          <div className="sm:hidden text-xs text-gray-600">${product.precio.toLocaleString()} | Stock: {product.stock}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-2 lg:p-3 hidden sm:table-cell text-sm lg:text-base">{product.categoria}</td>
                    <td className="p-2 lg:p-3 hidden md:table-cell text-sm lg:text-base">${product.precio.toLocaleString()}</td>
                    <td className="p-2 lg:p-3 hidden lg:table-cell text-sm lg:text-base">{product.stock}</td>
                    <td className="p-2 lg:p-3">
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                        <button
                          key={`edit-${product.id}`}
                          onClick={() => handleEditProduct(product)}
                          className="text-blue-600 hover:text-blue-800 text-xs lg:text-sm"
                        >
                          Editar
                        </button>
                        <button
                          key={`delete-${product.id}`}
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-800 text-xs lg:text-sm"
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
      )}

      {activeTab === 'users' && (
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <h2 className="text-lg lg:text-xl font-semibold">Gestión de Usuarios</h2>
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
              className="bg-green-600 text-white px-3 py-2 lg:px-4 rounded hover:bg-green-700 text-sm lg:text-base w-full sm:w-auto"
            >
              Agregar Usuario
            </button>
          </div>

          {showUserForm && (
            <div className="bg-white p-6 rounded shadow mb-6">
              <h3 className="text-lg font-semibold mb-4">
                {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h3>
              <form onSubmit={handleUserSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nombre"
                  value={userForm.nombre}
                  onChange={(e) => setUserForm({...userForm, nombre: e.target.value})}
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Apellido"
                  value={userForm.apellido}
                  onChange={(e) => setUserForm({...userForm, apellido: e.target.value})}
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Nombre de usuario"
                  value={userForm.username}
                  onChange={(e) => setUserForm({...userForm, username: e.target.value})}
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={userForm.password}
                  onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                  className="border p-2 rounded"
                  required
                  minLength="4"
                />
                <input
                  type="tel"
                  placeholder="Teléfono"
                  value={userForm.telefono}
                  onChange={(e) => setUserForm({...userForm, telefono: e.target.value})}
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Dirección"
                  value={userForm.direccion}
                  onChange={(e) => setUserForm({...userForm, direccion: e.target.value})}
                  className="border p-2 rounded"
                />
                <select
                  value={userForm.rol}
                  onChange={(e) => setUserForm({...userForm, rol: e.target.value})}
                  className="border p-2 rounded"
                >
                  <option key="cliente" value="cliente">Cliente</option>
                  <option key="admin" value="admin">Administrador</option>
                </select>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="activo"
                    checked={userForm.activo}
                    onChange={(e) => setUserForm({...userForm, activo: e.target.checked})}
                    className="border"
                  />
                  <label htmlFor="activo" className="text-sm">Usuario activo</label>
                </div>
                <div className="md:col-span-2 flex gap-2">
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    {editingUser ? 'Actualizar' : 'Guardar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUserForm(false)}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white p-4 lg:p-6 rounded shadow mb-4 lg:mb-6 overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-100">
                  <tr key="users-header">
                    <th className="p-2 lg:p-3 text-left text-xs lg:text-sm">Nombre</th>
                    <th className="p-2 lg:p-3 text-left text-xs lg:text-sm hidden sm:table-cell">Usuario</th>
                    <th className="p-2 lg:p-3 text-left text-xs lg:text-sm hidden md:table-cell">Email</th>
                    <th className="p-2 lg:p-3 text-left text-xs lg:text-sm hidden lg:table-cell">Rol</th>
                    <th className="p-2 lg:p-3 text-left text-xs lg:text-sm">Estado</th>
                    <th className="p-2 lg:p-3 text-left text-xs lg:text-sm hidden xl:table-cell">Ventas</th>
                    <th className="p-2 lg:p-3 text-left text-xs lg:text-sm hidden 2xl:table-cell">Contacto</th>
                    <th className="p-2 lg:p-3 text-left text-xs lg:text-sm">Acciones</th>
                  </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="p-2 lg:p-3 font-semibold text-sm lg:text-base">
                      <div className="truncate">
                        {user.nombre && user.apellido ? `${user.nombre} ${user.apellido}` : user.username}
                      </div>
                      <div className="sm:hidden text-xs text-gray-600 mt-1">
                        @{user.username}
                      </div>
                    </td>
                    <td className="p-2 lg:p-3 text-sm lg:text-base text-gray-600 hidden sm:table-cell">{user.username}</td>
                    <td className="p-2 lg:p-3 text-sm lg:text-base hidden md:table-cell">
                      <div className="truncate">{user.email}</div>
                    </td>
                    <td className="p-2 lg:p-3 hidden lg:table-cell">
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.rol === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.rol}
                      </span>
                    </td>
                    <td className="p-2 lg:p-3">
                      <button
                        onClick={() => handleToggleUserStatus(user)}
                        className={`px-2 py-1 rounded text-xs ${
                          user.activo ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {user.activo ? 'Activo' : 'Inactivo'}
                      </button>
                    </td>
                    <td className="p-2 lg:p-3 font-semibold text-green-600 text-sm lg:text-base hidden xl:table-cell">
                      ${calculateTotalSales(user.id).toLocaleString()}
                    </td>
                    <td className="p-2 lg:p-3 text-sm lg:text-base text-gray-600 hidden 2xl:table-cell">
                      <div key={`direccion-${user.id}`} className="truncate">{user.direccion}</div>
                      <div key={`telefono-${user.id}`} className="truncate">{user.telefono}</div>
                    </td>
                    <td className="p-2 lg:p-3">
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                        <button
                          key={`edit-${user.id}`}
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-800 text-xs lg:text-sm"
                        >
                          Editar
                        </button>
                        {user.username !== 'admin' && (
                          <button
                            key={`delete-${user.id}`}
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-800 text-xs lg:text-sm"
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
      )}

      {activeTab === 'orders' && (
        <div>
          <h2 className="text-lg lg:text-xl font-semibold mb-4">Gestión de Pedidos</h2>
          {orders.length === 0 ? (
            <div className="bg-white p-4 lg:p-6 rounded shadow text-center">
              <p className="text-gray-500">No hay pedidos registrados</p>
            </div>
          ) : (
            <div className="bg-white p-4 lg:p-6 rounded shadow overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead className="bg-gray-100">
                  <tr key="orders-header">
                    <th className="p-2 lg:p-3 text-left text-xs lg:text-sm">ID</th>
                    <th className="p-2 lg:p-3 text-left text-xs lg:text-sm">Cliente</th>
                    <th className="p-2 lg:p-3 text-left text-xs lg:text-sm hidden sm:table-cell">Fecha</th>
                    <th className="p-2 lg:p-3 text-left text-xs lg:text-sm hidden md:table-cell">Total</th>
                    <th className="p-2 lg:p-3 text-left text-xs lg:text-sm">Estado</th>
                    <th className="p-2 lg:p-3 text-left text-xs lg:text-sm hidden lg:table-cell">Productos</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={`${order.userId}-${order.id}`} className="border-t">
                      <td className="p-2 lg:p-3 font-mono text-xs lg:text-sm">#{order.id}</td>
                      <td className="p-2 lg:p-3">
                        <div key={`customer-${order.userId}`}>
                          <div className="font-semibold text-sm lg:text-base truncate">
                            {order.userNombre && order.userApellido ? 
                              `${order.userNombre} ${order.userApellido}` : 
                              order.username
                            }
                          </div>
                          <div className="text-xs lg:text-sm text-gray-600">@{order.username}</div>
                          <div className="text-xs lg:text-sm text-gray-600 hidden sm:block truncate">{order.userEmail}</div>
                          <div className="sm:hidden text-xs text-gray-600">
                            ${order.total.toLocaleString()}
                          </div>
                        </div>
                      </td>
                      <td className="p-2 lg:p-3 text-sm lg:text-base hidden sm:table-cell">{new Date(order.fecha).toLocaleDateString()}</td>
                      <td className="p-2 lg:p-3 font-semibold text-sm lg:text-base hidden md:table-cell">${order.total.toLocaleString()}</td>
                      <td className="p-2 lg:p-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          order.estado === 'completado' ? 'bg-green-100 text-green-800' :
                          order.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.estado || 'pendiente'}
                        </span>
                      </td>
                      <td className="p-2 lg:p-3 hidden lg:table-cell">
                        <div key={`products-${order.id}`} className="text-sm">
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
          )}
        </div>
      )}
    </div>
  );
}
