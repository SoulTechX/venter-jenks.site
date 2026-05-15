"use client";

import { useState } from "react";
import { Plus, Image as ImageIcon, Save, Trash2, Edit, Home, Search } from "lucide-react";
import { Propiedad } from "../../lib/notion";
import Link from "next/link";
import Image from "next/image";

// Usamos los datos de prueba como estado inicial para la UI
import propiedadesData from "../../data/propiedades.json";

export default function AdminPanel() {
  const [propiedades, setPropiedades] = useState<Propiedad[]>(
    propiedadesData.map(p => ({ ...p, id: String(p.id) })) as Propiedad[]
  );
  const [isEditing, setIsEditing] = useState(false);
  const [currentProp, setCurrentProp] = useState<Partial<Propiedad> | null>(null);

  const handleEdit = (prop: Propiedad) => {
    setCurrentProp(prop);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentProp({
      direccion: "",
      tipo: "Casa",
      operacion: "Venta",
      precio: "",
      dormitorios: 0,
      banos: 0,
      superficie_m2: null,
      fotos: [],
    });
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar en Notion o en el backend real.
    // Por ahora, simulamos que se guarda en el estado local.
    
    if (currentProp?.id) {
      // Actualizar existente
      setPropiedades(prev => prev.map(p => p.id === currentProp.id ? currentProp as Propiedad : p));
    } else {
      // Crear nuevo
      const newProp = { ...currentProp, id: String(Date.now()) } as Propiedad;
      setPropiedades([newProp, ...propiedades]);
    }
    
    setIsEditing(false);
    setCurrentProp(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que querés eliminar esta propiedad?")) {
      setPropiedades(prev => prev.filter(p => p.id !== id));
      // Aquí iría la llamada a la API para borrar en Notion/DB
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      
      {/* Sidebar Panel */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col">
        <div className="p-6 border-b border-gray-100 flex flex-col items-center">
           <div className="w-16 h-16 bg-[#4E9A6A] text-white rounded-xl flex items-center justify-center font-bold text-2xl shadow-lg mb-3">
             VJ
           </div>
           <h2 className="font-bold text-gray-800 tracking-tight">Panel de Control</h2>
           <p className="text-xs text-gray-500">Venter Jenks Admin</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button className="flex items-center gap-3 w-full px-4 py-3 bg-[#4E9A6A]/10 text-[#4E9A6A] rounded-lg font-medium transition-colors">
            <Home size={18} /> Propiedades
          </button>
          <Link href="/" className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors">
            <Search size={18} /> Ver Sitio Web
          </Link>
        </nav>
        
        <div className="p-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">v1.0.0 - Modo Local</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight">Gestión de Propiedades</h1>
            <p className="text-gray-500 mt-1">Administrá el catálogo que se muestra en tu web.</p>
          </div>
          <button 
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-[#4E9A6A] hover:bg-[#3d7a54] text-white px-5 py-2.5 rounded-lg font-semibold shadow-md transition-all active:scale-95"
          >
            <Plus size={18} /> Nueva Propiedad
          </button>
        </div>

        {isEditing && currentProp ? (
          /* FORMLARIO DE EDICION / CREACION */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {currentProp.id ? "Editar Propiedad" : "Cargar Nueva Propiedad"}
              </h2>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600 font-medium text-sm">
                Cancelar
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Dirección */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Dirección / Título</label>
                  <input 
                    type="text" 
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#4E9A6A] focus:border-transparent outline-none transition-all"
                    placeholder="Ej: Pto. Moreno 113"
                    value={currentProp.direccion || ""}
                    onChange={e => setCurrentProp({...currentProp, direccion: e.target.value})}
                  />
                </div>

                {/* Tipo */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo de Propiedad</label>
                  <select 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#4E9A6A]"
                    value={currentProp.tipo || "Casa"}
                    onChange={e => setCurrentProp({...currentProp, tipo: e.target.value})}
                  >
                    <option value="Casa">Casa</option>
                    <option value="Departamento">Departamento</option>
                    <option value="Lote">Lote / Terreno</option>
                    <option value="Local Comercial">Local Comercial</option>
                    <option value="Oficina">Oficina</option>
                    <option value="Chacra">Chacra / Estancia</option>
                  </select>
                </div>

                {/* Operación */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Operación</label>
                  <select 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#4E9A6A]"
                    value={currentProp.operacion || "Venta"}
                    onChange={e => setCurrentProp({...currentProp, operacion: e.target.value})}
                  >
                    <option value="Venta">Venta</option>
                    <option value="Alquiler">Alquiler</option>
                    <option value="Alquiler Temporario">Alquiler Temporario</option>
                  </select>
                </div>

                {/* Precio */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Precio a mostrar</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#4E9A6A]"
                    placeholder="Ej: USD 120.000 / Consultar"
                    value={currentProp.precio || ""}
                    onChange={e => setCurrentProp({...currentProp, precio: e.target.value})}
                  />
                </div>

                {/* Superficie */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Superficie (m²)</label>
                  <input 
                    type="number" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#4E9A6A]"
                    placeholder="Ej: 150"
                    value={currentProp.superficie_m2 || ""}
                    onChange={e => setCurrentProp({...currentProp, superficie_m2: parseInt(e.target.value) || null})}
                  />
                </div>

                {/* Dormitorios */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Dormitorios</label>
                  <input 
                    type="number" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#4E9A6A]"
                    min="0"
                    value={currentProp.dormitorios || 0}
                    onChange={e => setCurrentProp({...currentProp, dormitorios: parseInt(e.target.value) || 0})}
                  />
                </div>

                {/* Baños */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Baños</label>
                  <input 
                    type="number" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#4E9A6A]"
                    min="0"
                    value={currentProp.banos || 0}
                    onChange={e => setCurrentProp({...currentProp, banos: parseInt(e.target.value) || 0})}
                  />
                </div>

                {/* Fotos (Por ahora simple texto separado por comas) */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                    <ImageIcon size={16} /> Rutas de las fotos
                  </label>
                  <p className="text-xs text-gray-500 mb-2">Ingresá los nombres de las fotos separadas por comas. (Ej: /casa1.jpg, /casa2.jpg)</p>
                  <textarea 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#4E9A6A] font-mono text-sm"
                    rows={3}
                    value={(currentProp.fotos || []).join(", ")}
                    onChange={e => setCurrentProp({...currentProp, fotos: e.target.value.split(",").map(s => s.trim()).filter(Boolean)})}
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-white bg-[#4E9A6A] hover:bg-[#3d7a54] shadow-md transition-colors"
                >
                  <Save size={18} /> Guardar Propiedad
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* LISTA DE PROPIEDADES */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-200 text-gray-500 text-sm">
                    <th className="px-6 py-4 font-semibold">Propiedad</th>
                    <th className="px-6 py-4 font-semibold">Tipo</th>
                    <th className="px-6 py-4 font-semibold">Operación</th>
                    <th className="px-6 py-4 font-semibold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {propiedades.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                        No hay propiedades cargadas. ¡Empezá agregando una!
                      </td>
                    </tr>
                  ) : (
                    propiedades.map(prop => (
                      <tr key={prop.id} className="hover:bg-gray-50/80 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 relative rounded-lg bg-gray-200 overflow-hidden flex-shrink-0 border border-gray-200">
                              {prop.fotos?.[0] ? (
                                <Image src={prop.fotos[0]} alt="Miniatura" fill className="object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <ImageIcon size={20} />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-gray-800">{prop.direccion}</p>
                              <p className="text-xs text-gray-500">{prop.precio || "Precio a consultar"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{prop.tipo}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            prop.operacion === "Venta" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-purple-50 text-purple-700 border-purple-200"
                          }`}>
                            {prop.operacion}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleEdit(prop)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit size={18} />
                            </button>
                            <button 
                              onClick={() => handleDelete(prop.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
