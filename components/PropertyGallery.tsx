"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, MapPin, BedDouble, Bath, Maximize } from "lucide-react";
import { Propiedad } from "../lib/notion";

interface PropertyGalleryProps {
  initialProperties: Propiedad[];
}


const LogoSVG = () => (
  <svg width="100" height="40" viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg">
    <text x="5" y="16" fontFamily="Georgia, serif" fontSize="14" fill="#FFFFFF" fontWeight="bold">Venter</text>
    <text x="5" y="32" fontFamily="Georgia, serif" fontSize="14" fill="#FFFFFF" fontWeight="bold">Jenks</text>
    <g transform="translate(60, 5)" stroke="#FFFFFF" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 15 L15 5 L25 15" />
      <rect x="8" y="15" width="14" height="10" />
      <circle cx="15" cy="20" r="2" fill="#FFFFFF" />
      <path d="M15 22 L15 28 M13 28 L17 28 M13 25 L17 25" />
    </g>
  </svg>
);

const PropertyCard = ({ propiedad }: { propiedad: Propiedad }) => {
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
    <div className="group relative w-full overflow-hidden rounded-xl bg-gray-100 shadow-md" style={{ aspectRatio: "3/4" }}>
      {/* Background Image */}
      <Image
        src={propiedad.fotos[currentImage] || "/placeholder.svg"}
        alt={`${propiedad.tipo} en ${propiedad.direccion}`}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />

      {/* Navigation Arrows (Visible only on hover, just above footer) */}
      {totalImages > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 bottom-14 z-20 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#4E9A6A]/60 text-white opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-[#4E9A6A] group-hover:opacity-100"
            aria-label="Foto anterior"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 bottom-14 z-20 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#4E9A6A]/60 text-white opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-[#4E9A6A] group-hover:opacity-100"
            aria-label="Siguiente foto"
          >
            <ChevronRight size={14} />
          </button>
        </>
      )}

      {/* Hover Overlay */}
      <div className="absolute inset-0 flex flex-col justify-between opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10 pointer-events-none">
        
        {/* TOP: Header */}
        <div className="flex w-full items-stretch bg-white/[0.85] backdrop-blur-md">
          {/* Logo Section */}
          <div className="flex items-center justify-center bg-[#4E9A6A] px-3 py-2">
            <LogoSVG />
          </div>
          {/* Info Section */}
          <div className="flex flex-1 flex-col items-end justify-center px-4 py-2 text-[#4E9A6A]">
            <span className="text-xs font-medium uppercase tracking-wider">{propiedad.tipo}</span>
            <span className="text-lg font-bold uppercase leading-tight">{propiedad.operacion}</span>
          </div>
        </div>

        {/* MIDDLE: Pills */}
        <div className="flex flex-1 flex-col items-start justify-center gap-3 p-5">
          {/* Pill: Dirección */}
          <div className="flex items-center gap-3 rounded-full bg-white/[0.82] py-1.5 pl-1.5 pr-4 backdrop-blur-sm shadow-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#4E9A6A] text-white">
              <MapPin size={16} />
            </div>
            <span className="font-medium text-[#4E9A6A] text-sm">{propiedad.direccion}</span>
          </div>

          {/* Pill: Dormitorios */}
          {propiedad.dormitorios > 0 && (
            <div className="flex items-center gap-3 rounded-full bg-white/[0.82] py-1.5 pl-1.5 pr-4 backdrop-blur-sm shadow-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#4E9A6A] text-white">
                <BedDouble size={16} />
              </div>
              <span className="font-medium text-[#4E9A6A] text-sm">{propiedad.dormitorios} Dormitorios</span>
            </div>
          )}

          {/* Pill: Baños */}
          <div className="flex items-center gap-3 rounded-full bg-white/[0.82] py-1.5 pl-1.5 pr-4 backdrop-blur-sm shadow-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#4E9A6A] text-white">
              <Bath size={16} />
            </div>
            <span className="font-medium text-[#4E9A6A] text-sm">{propiedad.banos} {propiedad.banos === 1 ? "Baño" : "Baños"}</span>
          </div>

          {/* Pill: M2 */}
          {propiedad.superficie_m2 && (
            <div className="flex items-center gap-3 rounded-full bg-white/[0.82] py-1.5 pl-1.5 pr-4 backdrop-blur-sm shadow-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#4E9A6A] text-white">
                <Maximize size={16} />
              </div>
              <span className="font-medium text-[#4E9A6A] text-sm">{propiedad.superficie_m2} m²</span>
            </div>
          )}
        </div>

        {/* BOTTOM: Dots & Footer */}
        <div className="flex flex-col">
          {/* Dots */}
          {totalImages > 1 && (
            <div className="flex w-full justify-center gap-2 bg-[#4E9A6A]/[0.88] py-2 backdrop-blur-sm">
              {propiedad.fotos.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                    currentImage === idx ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex w-full items-center justify-between bg-[#4E9A6A]/[0.92] px-4 py-3 backdrop-blur-sm">
            <span className="text-xs font-medium text-white tracking-wide">@venterjenks_inmobiliaria</span>
            <span className="text-xs font-medium text-white tracking-wide">+54 9 2974365975</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function PropertyGallery({ initialProperties }: PropertyGalleryProps) {
  const [filtroOperacion, setFiltroOperacion] = useState<string>("Todas");

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {propiedadesFiltradas.map((prop) => (
            <PropertyCard key={prop.id} propiedad={prop} />
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
    </div>
  );
}
