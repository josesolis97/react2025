import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    pageSize: 10,
  });
  const [loading, setLoading] = useState(true);
  const [addedFeedback, setAddedFeedback] = useState(new Set());
  const { addToCart } = useAuth();

  const fetchProducts = (page = 1) => {
    setLoading(true);
    fetch(`https://apiresfull25023.vercel.app/api/products?page=${page}`)
      .then((res) => {
        if (!res.ok) throw new Error("Error en la red");
        return res.json();
      })
      .then((response) => {
        if (Array.isArray(response.data)) {
          setProducts(response.data);
          setPagination(response.pagination || {
            totalItems: 0,
            totalPages: 1,
            currentPage: page,
            pageSize: 10,
          });
        } else {
          setProducts([]);
          setPagination({ totalItems: 0, totalPages: 1, currentPage: page, pageSize: 10 });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar productos:", err);
        setProducts([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts(1);
  }, []);

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
      fetchProducts(page);
    }
  };

  if (loading) return <p className="text-center">Cargando productos...</p>;

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {products.map((p) => (
          <div key={p.id} className="bg-white p-4 rounded shadow">
            <img
              src={p.imageUrl?.trim() || "https://cdn.pixabay.com/photo/2023/07/17/10/00/question-mark-8133032_1280.png"}
              alt={p.name}
              className="w-full h-40 object-cover rounded"
              onError={(e) => {
                e.target.src = "https://cdn.pixabay.com/photo/2023/07/17/10/00/question-mark-8133032_1280.png";
              }}
            />
            <h3 className="font-semibold mt-2">{p.name}</h3>
            <p className="text-sm text-gray-600">{p.description}</p>
            <div className="mt-3 flex items-center justify-between">
              <div className="font-bold">${p.price.toLocaleString()}</div>
              <button
                onClick={() =>
                  handleAddToCart({
                    id: p.id,
                    name: p.name,
                    price: p.price,
                    image: p.imageUrl?.trim() || "",
                  })
                }
                className={`px-3 py-1 rounded text-white font-medium transition-colors ${
                  addedFeedback.has(p.id)
                    ? "bg-green-700" 
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {addedFeedback.has(p.id) ? "✔ Agregado" : "Agregar"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Paginacion */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => goToPage(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className={`px-4 py-2 rounded ${
              pagination.currentPage === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Anterior
          </button>

          {[...Array(pagination.totalPages)].map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-4 py-2 rounded ${
                  pagination.currentPage === page
                    ? "bg-blue-800 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() => goToPage(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className={`px-4 py-2 rounded ${
              pagination.currentPage === pagination.totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Siguiente
          </button>
        </div>
      )}

      <p className="text-center text-gray-500 text-sm">
        Mostrando página {pagination.currentPage} de {pagination.totalPages} ({pagination.totalItems} productos)
      </p>
    </div>
  );
}