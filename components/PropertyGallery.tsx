"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, MapPin, BedDouble, Bath, Maximize, X } from "lucide-react";
import { Propiedad } from "../lib/notion";

interface PropertyGalleryProps {
  initialProperties: Propiedad[];
}

const PropertyCard = ({ propiedad, onClick }: { propiedad: Propiedad, onClick: (prop: Propiedad, imageIndex: number) => void }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const totalImages = propiedad.fotos.length;

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % totalImages);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  };

  return (
    <div 
      className="group relative w-full overflow-hidden rounded-xl bg-gray-200 shadow-lg cursor-pointer" 
      style={{ aspectRatio: "3/2" }}
      onClick={() => onClick(propiedad, currentImage)}
    >
      {/* 1. La imagen sola (estado normal) */}
      <Image
        src={propiedad.fotos[currentImage] || "/placeholder.svg"}
        alt={`${propiedad.tipo} en ${propiedad.direccion}`}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />

      {/* 2. Flechas pequeñas en la parte inferior (z-20 para que se puedan clickear siempre) */}
      {totalImages > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 opacity-80 transition-opacity hover:opacity-100 group-hover:opacity-100">
          <button
            onClick={prevImage}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-all hover:bg-[#4E9A6A] shadow-md"
            aria-label="Foto anterior"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex items-center justify-center bg-black/50 px-3 py-1 rounded-full backdrop-blur-md text-white text-xs font-semibold shadow-md">
            {currentImage + 1} / {totalImages}
          </div>
          <button
            onClick={nextImage}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-all hover:bg-[#4E9A6A] shadow-md"
            aria-label="Siguiente foto"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* 3. El Marco que aparece al pasar el cursor (Hover Overlay) */}
      <div className="absolute inset-0 z-10 flex p-3 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none">
        {/* El marco interno translúcido (Glassmorphism) del color principal */}
        <div className="relative flex w-full h-full flex-col justify-between overflow-hidden rounded-lg bg-[#4E9A6A]/85 backdrop-blur-md border border-white/50 shadow-2xl">
          
          {/* Cabecera */}
          <div className="flex flex-col items-center justify-center p-5 border-b border-white/20 bg-white/5">
             <span className="!text-white/90 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">{propiedad.tipo}</span>
             <span className="!text-white text-xl font-black uppercase tracking-tight text-center drop-shadow-sm">{propiedad.operacion}</span>
          </div>

          {/* Datos de la propiedad */}
          <div className="flex flex-col gap-4 p-6 flex-1 justify-center">
            <div className="flex items-center gap-3">
              <MapPin size={20} className="!text-white" strokeWidth={2.5} />
              <span className="!text-white font-medium text-sm leading-snug drop-shadow-sm">{propiedad.direccion}</span>
            </div>
            
            {propiedad.dormitorios > 0 && (
              <div className="flex items-center gap-3">
                <BedDouble size={20} className="!text-white" strokeWidth={2.5} />
                <span className="!text-white font-medium text-sm drop-shadow-sm">{propiedad.dormitorios} Dormitorios</span>
              </div>
            )}
            
            <div className="flex items-center gap-3">
              <Bath size={20} className="!text-white" strokeWidth={2.5} />
              <span className="!text-white font-medium text-sm drop-shadow-sm">{propiedad.banos} {propiedad.banos === 1 ? "Baño" : "Baños"}</span>
            </div>
            
            {propiedad.superficie_m2 && (
              <div className="flex items-center gap-3">
                <Maximize size={20} className="!text-white" strokeWidth={2.5} />
                <span className="!text-white font-medium text-sm drop-shadow-sm">{propiedad.superficie_m2} m²</span>
              </div>
            )}
          </div>

          <div className="bg-black/20 p-4 text-center pb-12">
            <span className="!text-white text-lg font-black tracking-wider drop-shadow-md">
              {propiedad.precio || "Consultar valor"}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default function PropertyGallery({ initialProperties }: PropertyGalleryProps) {
  const [filtroOperacion, setFiltroOperacion] = useState<string>("Todas");
  
  // Lightbox state
  const [lightboxProp, setLightboxProp] = useState<Propiedad | null>(null);
  const [lightboxImageIndex, setLightboxImageIndex] = useState<number>(0);

  // Obtener operaciones únicas para los botones de filtro
  const operacionesUnicas = ["Todas", ...Array.from(new Set(initialProperties.map(p => p.operacion)))];

  // Filtrar propiedades
  const propiedadesFiltradas = initialProperties.filter(prop => 
    filtroOperacion === "Todas" || prop.operacion === filtroOperacion
  );

  if (!initialProperties || initialProperties.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-600">No hay propiedades disponibles por el momento.</h2>
        <p className="text-gray-500 mt-2">Vuelve a revisar más tarde.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Filtros */}
      <div className="mb-10 flex flex-wrap justify-center gap-3">
        {operacionesUnicas.map(op => (
          <button
            key={op}
            onClick={() => setFiltroOperacion(op)}
            className={`rounded-full px-6 py-2 text-sm font-semibold transition-all duration-300 ${
              filtroOperacion === op 
                ? "bg-[#4E9A6A] text-white shadow-md" 
                : "bg-white text-gray-600 hover:bg-gray-100 shadow-sm border border-gray-200"
            }`}
          >
            {op}
          </button>
        ))}
      </div>

      {/* Grid de Propiedades */}
      {propiedadesFiltradas.length > 0 ? (
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
          {propiedadesFiltradas.map((prop) => (
            <PropertyCard 
              key={prop.id} 
              propiedad={prop} 
              onClick={(p, imgIndex) => {
                setLightboxProp(p);
                setLightboxImageIndex(imgIndex);
              }} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">No se encontraron propiedades para la operación seleccionada.</p>
          <button 
            onClick={() => setFiltroOperacion("Todas")}
            className="mt-4 text-[#4E9A6A] font-medium hover:underline"
          >
            Ver todas las propiedades
          </button>
        </div>
      )}
      {/* Lightbox Modal */}
      {lightboxProp && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-10 backdrop-blur-sm"
          onClick={() => setLightboxProp(null)}
        >
          <button 
            onClick={() => setLightboxProp(null)}
            className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors bg-black/50 p-2 rounded-full z-50"
            aria-label="Cerrar"
          >
            <X size={32} />
          </button>
          
          <div 
            className="relative w-full h-full max-w-6xl max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()} // Evita que se cierre al clickear la imagen
          >
            <Image
              src={lightboxProp.fotos[lightboxImageIndex] || "/placeholder.svg"}
              alt={`Vista en grande de ${lightboxProp.direccion}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
            
            {lightboxProp.fotos.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxImageIndex((prev) => (prev === 0 ? lightboxProp.fotos.length - 1 : prev - 1));
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full transition-colors z-50"
                >
                  <ChevronLeft size={32} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxImageIndex((prev) => (prev + 1) % lightboxProp.fotos.length);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full transition-colors z-50"
                >
                  <ChevronRight size={32} />
                </button>
                
                <div className="absolute bottom-4 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-black/60 px-4 py-2 rounded-full text-white font-semibold">
                  {lightboxImageIndex + 1} / {lightboxProp.fotos.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
