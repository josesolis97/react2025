import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); 
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos guardados en localStorage al iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedCart = localStorage.getItem('cart');
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedCart) setCart(JSON.parse(savedCart));
    setLoading(false);
  }, []);

 // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Guardar usuario en localStorage cuando cambie
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (credentials) => {
    try {
      // Obtener todos los usuarios
      const response = await fetch('https://68d5d2a1e29051d1c0afa80c.mockapi.io/api/v1/usuarios');
      if (!response.ok) {
        throw new Error('Error al obtener usuarios');
      }
      const users = await response.json();
      
      // Buscar usuario por username y password
      const user = users.find(u => 
        u.username === credentials.username && 
        u.password === credentials.password
      );
      
      if (!user) {
        return { ok: false, message: "Usuario o contraseña incorrectos" };
      }
      
      // Verificar si el usuario está activo
      if (user.activo === undefined || user.activo === null) {
        return { ok: false, message: "Estado de usuario no definido. Contacte al administrador." };
      }
      
      if (!user.activo) {
        return { ok: false, message: "Usuario inactivo. Contacte al administrador." };
      }
      
      // Crear objeto de usuario sin datos sensibles
      const userData = {
        username: user.username,
        email: user.email,
        rol: user.rol,
        direccion: user.direccion,
        telefono: user.telefono,
        nombre: user.nombre,
        apellido: user.apellido
      };
      setUser(userData);
      return { ok: true, user: userData };
    } catch (error) {
      return { ok: false, message: "Error de conexión al iniciar sesión. Por favor intenta nuevamente." };
    }
  };

  const logout = () => {
    setUser(null);
  };

  const addToCart = (product) => {
    setCart(prev => {
      // Verificar si el producto ya existe en el carrito
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        // Si existe, incrementar cantidad
        return prev.map(item =>
          item.id === product.id
            ? { ...item, cantidad: (item.cantidad || 1) + 1 }
            : item
        );
      } else {
        // Si no existe, agregar con cantidad 1
        return [...prev, { ...product, cantidad: 1 }];
      }
    });
  };

  const removeFromCart = (id) => {
    // Eliminar producto del carrito por ID
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    // Vaciar todo el carrito
    setCart([]);
  };

  const getTotalItems = () => {
    // Calcular cantidad total de items en el carrito
    return cart.reduce((sum, item) => sum + (item.cantidad || 0), 0);
  };

  const getTotalPrice = () => {
    // Calcular precio total del carrito
    return cart.reduce((sum, item) => sum + ((item.precio || 0) * (item.cantidad || 0)), 0);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}