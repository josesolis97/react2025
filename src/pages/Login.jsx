import React from 'react'; 
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ username, password });
      if (res.ok) {
        // Redirigir según el rol del usuario
        if (res.user?.rol === 'admin') {
          navigate("/admin");
        } else {
          navigate("/products");
        }
      } else {
        setErr(res.message || "Error");
      }
    } catch (error) {
      setErr("Error de conexión");
      console.error('Error en login:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Iniciar sesión</h2>
      <form onSubmit={submit} className="bg-white p-6 rounded shadow">
        {err && <div className="bg-red-100 text-red-700 p-2 mb-3 rounded">{err}</div>}
        <label className="block mb-2">
          Usuario
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border p-2 mt-1 rounded"
          />
        </label>
        <label className="block mb-4">
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 mt-1 rounded"
          />
        </label>
        <div className="flex gap-3">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Entrar
          </button>
          <button
            type="button"
            onClick={() => {
              setUsername("jose");
              setPassword("admin123");
            }}
            className="px-3 py-2 border rounded"
          >
            Autocompletar (admin)
          </button>
          <button
            type="button"
            onClick={() => {
              setUsername("juan");
              setPassword("juan123");
            }}
            className="px-3 py-2 border rounded"
          >
            Autocompletar (cliente)
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-3">
          Credenciales: <strong>jose / admin1234</strong> o <strong>juan / juan123</strong>
        </p>
      </form>
    </div>
  );
}