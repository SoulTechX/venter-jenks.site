"use client";

import { useState, useEffect } from "react";
import { Plus, Image as ImageIcon, Save, Trash2, Edit } from "lucide-react";
import { Propiedad } from "../../lib/notion";
import Link from "next/link";
import Image from "next/image";

export default function AdminPanel() {
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProp, setCurrentProp] = useState<Partial<Propiedad> | null>(null);

  useEffect(() => {
    fetch('/api/propiedades')
      .then(res => res.json())
      .then(data => setPropiedades(data))
      .catch(err => console.error("Error al cargar", err));
  }, []);

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProp) return;
    
    const action = currentProp.id ? 'update' : 'create';
    const propToSave = { ...currentProp, id: currentProp.id || String(Date.now()) };
    
    // Guardamos optimista en la UI
    if (action === 'update') {
      setPropiedades(prev => prev.map(p => p.id === propToSave.id ? propToSave as Propiedad : p));
    } else {
      setPropiedades([propToSave as Propiedad, ...propiedades]);
    }

    setIsEditing(false);
    setCurrentProp(null);

    // Mandamos al servidor
    await fetch('/api/propiedades', {
      method: 'POST',
      body: JSON.stringify({ action, propiedad: propToSave })
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que querés eliminar esta propiedad?")) {
      setPropiedades(prev => prev.filter(p => p.id !== id));
      await fetch('/api/propiedades', {
        method: 'POST',
        body: JSON.stringify({ action: 'delete', propiedad: { id } })
      });
    }
  };

  return (
    <>
      {/* Header idéntico a la web principal */}
      <header>
        <nav>
          <div className="logo">
            <Image src="/img/logo.PNG" alt="Venter Jenks" width={150} height={100} className="logo-img" />
          </div>
          <ul className="nav-links">
            <li><Link href="/">Volver a la Web</Link></li>
          </ul>
        </nav>
      </header>

      {/* Main Section */}
      <section className="service-section" style={{ minHeight: '100vh', paddingTop: '160px', paddingBottom: '80px', backgroundColor: 'var(--bg-light)' }}>
        <div className="container">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '10px' }}>Gestión de Propiedades</h2>
              <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>Administrá el catálogo de tu web. Recordá que podés usar imágenes de fotos.venter-jenks.site.</p>
            </div>
            <button 
              onClick={handleAddNew}
              className="btn btn-primary flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <Plus size={18} /> Nueva Propiedad
            </button>
          </div>

          {isEditing && currentProp ? (
            /* FORMULARIO */
            <div className="form-container" style={{ maxWidth: '800px', width: '100%' }}>
              <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
                <h3 className="text-xl font-bold" style={{ color: 'var(--text-dark)' }}>
                  {currentProp.id ? "Editar Propiedad" : "Cargar Nueva Propiedad"}
                </h3>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-dark)' }}>Dirección / Título</label>
                    <input 
                      type="text" 
                      required
                      className="form-control"
                      placeholder="Ej: Pto. Moreno 113"
                      value={currentProp.direccion || ""}
                      onChange={e => setCurrentProp({...currentProp, direccion: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-dark)' }}>Tipo de Propiedad</label>
                    <select 
                      className="form-control"
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

                  <div>
                    <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-dark)' }}>Operación</label>
                    <select 
                      className="form-control"
                      value={currentProp.operacion || "Venta"}
                      onChange={e => setCurrentProp({...currentProp, operacion: e.target.value})}
                    >
                      <option value="Venta">Venta</option>
                      <option value="Alquiler">Alquiler</option>
                      <option value="Alquiler Temporario">Alquiler Temporario</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-dark)' }}>Precio a mostrar</label>
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="Ej: USD 120.000 / Consultar"
                      value={currentProp.precio || ""}
                      onChange={e => setCurrentProp({...currentProp, precio: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-dark)' }}>Superficie (m²)</label>
                    <input 
                      type="number" 
                      className="form-control"
                      placeholder="Ej: 150"
                      value={currentProp.superficie_m2 || ""}
                      onChange={e => setCurrentProp({...currentProp, superficie_m2: parseInt(e.target.value) || null})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-dark)' }}>Dormitorios</label>
                    <input 
                      type="number" 
                      className="form-control"
                      min="0"
                      value={currentProp.dormitorios || 0}
                      onChange={e => setCurrentProp({...currentProp, dormitorios: parseInt(e.target.value) || 0})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-dark)' }}>Baños</label>
                    <input 
                      type="number" 
                      className="form-control"
                      min="0"
                      value={currentProp.banos || 0}
                      onChange={e => setCurrentProp({...currentProp, banos: parseInt(e.target.value) || 0})}
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-semibold mb-1 flex items-center gap-2" style={{ color: 'var(--text-dark)' }}>
                      <ImageIcon size={16} /> Links de las fotos
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                      Pegá los links de las fotos generados por tu panel (<a href="https://fotos.venter-jenks.site/panel.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline">fotos.venter-jenks.site/panel.html</a>) separados por comas.
                    </p>
                    <textarea 
                      className="form-control"
                      rows={3}
                      value={(currentProp.fotos || []).join(", ")}
                      onChange={e => setCurrentProp({...currentProp, fotos: e.target.value.split(",").map(s => s.trim()).filter(Boolean)})}
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-gray-200">
                  <button 
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="btn btn-outline"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="btn btn-primary flex items-center gap-2"
                  >
                    <Save size={18} /> Guardar Propiedad
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* TABLA DE PROPIEDADES */
            <div style={{ backgroundColor: 'var(--secondary-color)', borderRadius: '10px', padding: '30px', boxShadow: 'var(--shadow)', overflowX: 'auto' }}>
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-dark)' }}>
                    <th className="px-4 py-4 font-semibold">Propiedad</th>
                    <th className="px-4 py-4 font-semibold">Tipo</th>
                    <th className="px-4 py-4 font-semibold">Operación</th>
                    <th className="px-4 py-4 font-semibold text-right">Acciones</th>
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
                      <tr key={prop.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 relative rounded-lg bg-gray-200 overflow-hidden flex-shrink-0 border border-gray-200">
                              {prop.fotos?.[0] ? (
                                <Image src={prop.fotos[0]} alt="Miniatura" fill className="object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <ImageIcon size={20} />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-bold" style={{ color: 'var(--text-dark)' }}>{prop.direccion}</p>
                              <p className="text-sm" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>{prop.precio || "Consultar"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm" style={{ color: 'var(--text-light)' }}>{prop.tipo}</td>
                        <td className="px-4 py-4">
                          <span className={`inline-block px-3 py-1 rounded text-xs font-bold ${
                            prop.operacion === "Venta" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                          }`}>
                            {prop.operacion}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex justify-end gap-3">
                            <button 
                              onClick={() => handleEdit(prop)}
                              className="text-blue-500 hover:text-blue-700 transition-colors"
                              title="Editar"
                            >
                              <Edit size={20} />
                            </button>
                            <button 
                              onClick={() => handleDelete(prop.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
