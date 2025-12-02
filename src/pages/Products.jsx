import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    pageSize: 8,
  });
  const [loading, setLoading] = useState(true);
  const [addedFeedback, setAddedFeedback] = useState(new Set());
  const { addToCart } = useAuth();

  const fetchProducts = (page = 1) => {
    setLoading(true);
    fetch(`https://68d5d2a1e29051d1c0afa80c.mockapi.io/api/v1/productos`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar los productos");
        return res.json();
      })
      .then((response) => {
        if (Array.isArray(response)) {
          setAllProducts(response);
          const totalPages = Math.ceil(response.length / pagination.pageSize);
          setPagination(prev => ({
            ...prev,
            totalItems: response.length,
            totalPages: totalPages,
            currentPage: page,
          }));
        } else {
          setAllProducts([]);
          setProducts([]);
          setPagination(prev => ({
            ...prev,
            totalItems: 0,
            totalPages: 1,
            currentPage: 1,
          }));
        }
        setLoading(false);
      })
      .catch((err) => {
        alert('Error al cargar los productos. Por favor recarga la página.');
        setAllProducts([]);
        setProducts([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts(1);
  }, []);

  useEffect(() => {
    const filtered = allProducts.filter(product =>
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Apply pagination to filtered results
    const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    const paginatedProducts = filtered.slice(startIndex, endIndex);
    
    setProducts(paginatedProducts);
    
    // Update pagination info for filtered results
    const totalPages = Math.ceil(filtered.length / pagination.pageSize);
    setPagination(prev => ({
      ...prev,
      totalItems: filtered.length,
      totalPages: totalPages,
    }));
  }, [searchTerm, allProducts, pagination.currentPage, pagination.pageSize]);

  const handleAddToCart = (product) => {
    addToCart(product);

  
    const newFeedback = new Set(addedFeedback);
    newFeedback.add(product.id);
    setAddedFeedback(newFeedback);

    
    setTimeout(() => {
      setAddedFeedback((prev) => {
        const updated = new Set(prev);
        updated.delete(product.id);
        return updated;
      });
    }, 1500);
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination(prev => ({
        ...prev,
        currentPage: page,
      }));
    }
  };

  if (loading) return <p className="text-center">Cargando productos...</p>;

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
      <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:gap-4">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            <label className="text-xs sm:text-sm font-medium whitespace-nowrap">Mostrar:</label>
            <select
              value={pagination.pageSize}
              onChange={(e) => {
                const newSize = parseInt(e.target.value);
                setPagination(prev => ({
                  ...prev,
                  pageSize: newSize,
                  currentPage: 1,
                }));
              }}
              className="px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={4}>4</option>
              <option value={8}>8</option>
              <option value={12}>12</option>
              <option value={16}>16</option>
            </select>
          </div>
          <div className="text-xs sm:text-sm text-gray-500">
            {pagination.totalItems} productos
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-6 sm:mb-8">
        {products.map((p) => (
          <div key={p.id} className="bg-white p-3 sm:p-4 rounded-lg shadow-sm sm:shadow hover:shadow-md transition-shadow duration-200">
            <div className="relative overflow-hidden rounded-lg mb-3">
              <img
                src={p.imagen || "https://cdn.pixabay.com/photo/2023/07/17/10/00/question-mark-8133032_1280.png"}
                alt={p.nombre}
                className="w-full h-32 sm:h-40 object-cover"
                onError={(e) => {
                  e.target.src = "https://cdn.pixabay.com/photo/2023/07/17/10/00/question-mark-8133032_1280.png";
                }}
              />
            </div>
            <h3 className="font-semibold text-sm sm:text-base mb-1 line-clamp-2">{p.nombre}</h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">{p.descripcion}</p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm text-gray-500">Stock: {p.stock}</span>
              <span className="font-bold text-sm sm:text-base text-green-600">${p.precio.toLocaleString()}</span>
            </div>
            <button
              onClick={() =>
                handleAddToCart({
                  id: p.id,
                  nombre: p.nombre,
                  precio: p.precio,
                  imagen: p.imagen || "",
                })
              }
              className={`w-full px-3 py-2 sm:py-2.5 rounded-lg text-white font-medium text-xs sm:text-sm transition-all duration-200 ${
                addedFeedback.has(p.id)
                  ? "bg-green-700" 
                  : "bg-green-600 hover:bg-green-700 active:scale-95"
              }`}
            >
              {addedFeedback.has(p.id) ? "✔ Agregado" : "Agregar al carrito"}
            </button>
          </div>
        ))}
      </div>

      {/* Paginacion */}
      {pagination.totalPages > 1 && (
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
          {/* Mobile view - simplified */}
          <div className="block sm:hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs text-gray-600">
                {products.length} de {pagination.totalItems}
              </div>
              <div className="text-xs text-gray-600">
                Pág. {pagination.currentPage}/{pagination.totalPages}
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => goToPage(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className={`px-3 py-2 rounded text-xs font-medium ${
                  pagination.currentPage === 1
                    ? "bg-gray-300 text-gray-500"
                    : "bg-blue-600 text-white active:scale-95"
                }`}
              >
                ←
              </button>
              <div className="flex gap-1">
                {(() => {
                  const pages = [];
                  const maxVisible = 3;
                  const start = Math.max(1, pagination.currentPage - Math.floor(maxVisible / 2));
                  const end = Math.min(pagination.totalPages, start + maxVisible - 1);
                  
                  for (let i = start; i <= end; i++) {
                    pages.push(i);
                  }
                  
                  return pages.map(page => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-2.5 py-2 rounded text-xs font-medium ${
                        pagination.currentPage === page
                          ? "bg-blue-800 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  ));
                })()}
              </div>
              <button
                onClick={() => goToPage(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className={`px-3 py-2 rounded text-xs font-medium ${
                  pagination.currentPage === pagination.totalPages
                    ? "bg-gray-300 text-gray-500"
                    : "bg-blue-600 text-white active:scale-95"
                }`}
              >
                →
              </button>
            </div>
          </div>

          {/* Desktop view - full */}
          <div className="hidden sm:flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              Mostrando {products.length} de {pagination.totalItems} productos
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className={`px-3 py-2 rounded text-sm font-medium ${
                  pagination.currentPage === 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                ← Anterior
              </button>

              <div className="flex gap-1">
                {(() => {
                  const pages = [];
                  const maxVisible = 5;
                  const start = Math.max(1, pagination.currentPage - Math.floor(maxVisible / 2));
                  const end = Math.min(pagination.totalPages, start + maxVisible - 1);
                  
                  for (let i = start; i <= end; i++) {
                    pages.push(i);
                  }
                  
                  return pages.map(page => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-3 py-2 rounded text-sm font-medium ${
                        pagination.currentPage === page
                          ? "bg-blue-800 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {page}
                    </button>
                  ));
                })()}
              </div>

              <button
                onClick={() => goToPage(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className={`px-3 py-2 rounded text-sm font-medium ${
                  pagination.currentPage === pagination.totalPages
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Siguiente →
              </button>
            </div>
            
            <div className="text-sm text-gray-600">
              Página {pagination.currentPage} de {pagination.totalPages}
            </div>
          </div>
        </div>
      )}

      <div className="text-center text-gray-500 text-xs sm:text-sm">
        {searchTerm ? `Encontrados ${products.length} productos` : `Mostrando ${products.length} de ${pagination.totalItems} productos`}
      </div>
    </div>
  );
}