import PropertyGallery from "../components/PropertyGallery";
import { getPropiedades } from "../lib/notion";

export const revalidate = 3600; // Revalidar cada hora (ISR)

export default async function Page() {
  const propiedades = await getPropiedades();

  return (
    <main className="min-h-screen bg-white">
      {/* Hero o encabezado simple */}
      <section className="bg-[#4E9A6A] py-20 text-center text-white">
        <h1 className="text-4xl font-bold uppercase tracking-tight md:text-6xl">
          Nuestras Propiedades
        </h1>
        <p className="mt-4 text-lg opacity-90">
          Explora nuestro catálogo actualizado desde Notion
        </p>
      </section>

      {/* Galería conectada */}
      <PropertyGallery initialProperties={propiedades} />
    </main>
  );
}
