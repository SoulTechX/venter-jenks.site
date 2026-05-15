import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';

const dataFilePath = path.join(process.cwd(), 'data', 'propiedades.json');

export async function GET() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (e) {
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  try {
    let data: any[] = [];
    try {
      const fileContent = await fs.readFile(dataFilePath, 'utf8');
      data = JSON.parse(fileContent);
    } catch (e) {
      // Archivo no existe o esta corrupto
    }

    if (body.action === 'create') {
      data.unshift(body.propiedad);
    } else if (body.action === 'update') {
      data = data.map(p => p.id === body.propiedad.id ? body.propiedad : p);
    } else if (body.action === 'delete') {
      data = data.filter(p => p.id !== body.propiedad.id);
    }

    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    
    // Forzamos a Next.js a reconstruir la página principal para que lea el nuevo JSON
    revalidatePath('/'); 
    
    return NextResponse.json({ success: true, data });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
