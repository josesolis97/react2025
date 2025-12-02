import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import AdminPanel from "./pages/AdminPanel";
import Register from "./pages/Register";
import CustomerPanel from "./pages/CustomerPanel";
import { AuthProvider, useAuth } from "./context/AuthContext";

function Protected({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function AdminProtected({ children }) {
  const { user } = useAuth();
  return user?.rol === 'admin' ? children : <Navigate to="/products" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <div className="min-h-screen flex flex-col">
          <Header />
          <Nav />
          <main className="flex-grow container mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<Products />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/products" element={<Products />} />
              <Route path="/cart" element={<Protected><Cart /></Protected>} />
              <Route path="/admin" element={<AdminProtected><AdminPanel /></AdminProtected>} />
              <Route path="/customer" element={<Protected><CustomerPanel /></Protected>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}