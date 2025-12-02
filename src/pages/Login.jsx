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
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Iniciar sesión</h2>
              
              {err && (
                <div className="alert alert-danger" role="alert">
                  {err}
                </div>
              )}
              
              <form onSubmit={submit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Usuario</label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="form-control"
                    placeholder="Ingrese su usuario"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                    placeholder="Ingrese su contraseña"
                    required
                  />
                </div>
                
                <div className="d-grid gap-2 mb-3">
                  <button type="submit" className="btn btn-primary">
                    Entrar
                  </button>
                </div>
                
                <div className="d-flex flex-column flex-sm-row gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      setUsername("jose");
                      setPassword("admin123");
                    }}
                    className="btn btn-outline-secondary btn-sm flex-fill"
                  >
                    Autocompletar (admin)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUsername("juan");
                      setPassword("juan123");
                    }}
                    className="btn btn-outline-secondary btn-sm flex-fill"
                  >
                    Autocompletar (cliente)
                  </button>
                </div>
                
                <div className="text-center">
                  <small className="text-muted">
                    Credenciales: <strong>jose / admin123</strong> o <strong>juan / juan123</strong>
                  </small>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}