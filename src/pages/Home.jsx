import React from "react";
export default function Home() {
  return (
    <section className="text-center py-12">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-lg overflow-hidden shadow-lg">
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/22/Cancha_sintetica.jpg" alt="Banner tienda" className="w-full h-64 object-cover"/>
          <div className="p-6 bg-white">
            <h2 className="text-3xl font-bold mb-2">Bienvenidos</h2>
            <p className="text-gray-600">Iniciá sesión para ver productos y agregarlos al carrito.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
