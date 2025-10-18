import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); 
  const [cart, setCart] = useState([]);

  
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedCart = localStorage.getItem('cart');
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

 
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (credentials) => {
    if (credentials.username === "admin" && credentials.password === "1234") {
      const userData = { username: "admin" };
      setUser(userData);
      return { ok: true };
    }
    return { ok: false, message: "Usuario o contraseña incorrectos" };
  };

  const logout = () => {
    setUser(null);
  };

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + (item.price * (item.quantity || 0)), 0);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
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