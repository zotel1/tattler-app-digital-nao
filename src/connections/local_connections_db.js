import fs from 'fs/promises';
import path from 'path';

// Función para cargar los datos desde el archivo JSON
export async function loadRestaurantsData() {
    try {
        const filePath = path.join(__dirname, 'data', 'data.json');
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al cargar los datos:', error.message);
        return [];
    }
}

// Función para simular la desconeción 
export async function desconnect() {
    console.log('Desconectando...');
}

// Función para generar un nuevo código de restaurante
export async function generateCodigo(data) {
    const maxCodigo = data.reduce((max, restaurant) => {
        return Math.max(max, parseInt(restaurant.restaurant_id))
    })
}