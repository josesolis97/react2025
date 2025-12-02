import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    nombre: '',
    apellido: '',
    direccion: '',
    telefono: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Verificar si el usuario ya existe
      const response = await fetch('https://68d5d2a1e29051d1c0afa80c.mockapi.io/api/v1/usuarios');
      const users = await response.json();
      
      const existingUser = users.find(u => u.username === formData.username);
      if (existingUser) {
        setError('El nombre de usuario ya está en uso');
        setLoading(false);
        return;
      }

      const existingEmail = users.find(u => u.email === formData.email);
      if (existingEmail) {
        setError('El email ya está registrado');
        setLoading(false);
        return;
      }

      // Crear nuevo usuario con rol cliente
      const newUser = {
        ...formData,
        rol: 'cliente',
        activo: true,
        pedidos: []
      };

      const createResponse = await fetch('https://68d5d2a1e29051d1c0afa80c.mockapi.io/api/v1/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });

      if (createResponse.ok) {
        // Auto login después del registro
        const loginResult = await login({
          username: formData.username,
          password: formData.password
        });
        
        if (loginResult.ok) {
          navigate('/products');
        } else {
          setError('Registro exitoso pero error al iniciar sesión');
        }
      } else {
        setError('Error al crear el usuario');
      }
    } catch (error) {
      setError('Error de conexión al registrar. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Crear Cuenta</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
        {error && <div className="bg-red-100 text-red-700 p-2 mb-3 rounded">{error}</div>}
        
        <label className="block mb-2">
          Nombre
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full border p-2 mt-1 rounded"
            required
          />
        </label>

        <label className="block mb-2">
          Apellido
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            className="w-full border p-2 mt-1 rounded"
            required
          />
        </label>

        <label className="block mb-2">
          Nombre de Usuario
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full border p-2 mt-1 rounded"
            required
            minLength="3"
          />
        </label>

        <label className="block mb-2">
          Email
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-2 mt-1 rounded"
            required
          />
        </label>

        <label className="block mb-2">
          Contraseña
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-2 mt-1 rounded"
            required
            minLength="4"
          />
        </label>

        <label className="block mb-2">
          Dirección
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            className="w-full border p-2 mt-1 rounded"
          />
        </label>

        <label className="block mb-4">
          Teléfono
          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="w-full border p-2 mt-1 rounded"
          />
        </label>

        <div className="flex gap-3">
          <button 
            type="submit" 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </button>
          <Link 
            to="/login" 
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
          >
            Cancelar
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-3">
          ¿Ya tienes cuenta? <Link to="/login" className="text-blue-600 hover:underline">Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
}
