import { Client } from "@notionhq/client";

// Tipado base que utilizaremos en la galería
export interface Propiedad {
  id: string;
  direccion: string;
  tipo: string;
  operacion: string;
  precio: string;
  dormitorios: number;
  banos: number;
  superficie_m2: number | null;
  fotos: string[];
}

// Inicializar el cliente de Notion
const notion = new Client({ auth: process.env.NOTION_TOKEN });

import propiedadesData from "../data/propiedades.json";

export async function getPropiedades(): Promise<Propiedad[]> {
  if (!process.env.NOTION_DATABASE_ID) {
    console.warn("Falta NOTION_DATABASE_ID en las variables de entorno. Usando datos locales de prueba.");
    // Mapeamos el JSON local al formato esperado (convirtiendo id a string si es necesario)
    return propiedadesData.map(p => ({
      ...p,
      id: String(p.id)
    })) as Propiedad[];
  }

  try {
    const response = await (notion.databases as any).query({
      database_id: process.env.NOTION_DATABASE_ID,
      filter: {
        property: "Activo",
        checkbox: { equals: true }
      }
    });

    return response.results.map((page: any) => ({
      id: page.id,
      direccion: page.properties["Nombre / Dirección"]?.title?.[0]?.plain_text || "Sin Dirección",
      tipo: page.properties["Tipo"]?.select?.name || "Sin tipo",
      operacion: page.properties["Operación"]?.select?.name || "Venta",
      precio: page.properties["Precio"]?.rich_text?.[0]?.plain_text || "",
      dormitorios: page.properties["Dormitorios"]?.number || 0,
      banos: page.properties["Baños"]?.number || 0,
      superficie_m2: page.properties["Superficie m²"]?.number || null,
      fotos: page.properties["Fotos"]?.files?.map((f: any) =>
        f.type === "external" ? f.external.url : f.file.url
      ) || [],
    }));
  } catch (error) {
    console.error("Error obteniendo datos de Notion:", error);
    return [];
  }
}
