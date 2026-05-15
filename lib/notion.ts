/* eslint-disable @typescript-eslint/no-explicit-any */
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

import fs from 'fs/promises';
import path from 'path';

export async function getPropiedades(): Promise<Propiedad[]> {
  if (!process.env.NOTION_DATABASE_ID) {
    try {
      const filePath = path.join(process.cwd(), 'data', 'propiedades.json');
      const fileData = await fs.readFile(filePath, 'utf-8');
      const propiedadesData = JSON.parse(fileData);
      return propiedadesData.map((p: any) => ({
        ...p,
        id: String(p.id)
      })) as Propiedad[];
    } catch (e) {
      console.warn("No se pudo leer propiedades.json", e);
      return [];
    }
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
