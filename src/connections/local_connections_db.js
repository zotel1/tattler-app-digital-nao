import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const dataPath = path.join(process.cwd(), 'src', 'data', 'data.json');

// Función para cargar los datos desde el archivo JSON
export async function loadRestaurantsData() {
    try {
        const data = await fs.readFile(dataPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al cargar los datos:', error.message);
        return [];
    }
}

// Función para guardar los datos en el archivo JSON
async function saveRestaurantsData(data) {
    try {
        await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error al guardar los datos:', error.message);
    }
}

// Función para simular la desconexión 
export async function desconnect() {
    console.log('Desconectando...');
}

// Función para generar un nuevo código de restaurante
export async function generateCodigo(data) {
    const maxCodigo = data.reduce((max, restaurant) => {
        return Math.max(max, parseInt(restaurant.restaurant_id));
    }, 0);
    return (maxCodigo + 1).toString();
}

// Función para actualizar un restaurante
export async function updateRestaurant(id, newData) {
    const data = await loadRestaurantsData();
    const index = data.findIndex(r => r.restaurant_id === id);

    if (index === -1) {
        return null; // Restaurante no encontrado
    }

    data[index] = { ...data[index], ...newData };
    await saveRestaurantsData(data);
    return data[index];
}

// Función para eliminar un restaurante
export async function deleteRestaurant(id) {
    let data = await loadRestaurantsData();
    const index = data.findIndex(r => r.restaurant_id === id);

    if (index === -1) {
        return null; // Restaurante no encontrado
    }

    const deletedRestaurant = data.splice(index, 1)[0];
    await saveRestaurantsData(data);
    return deletedRestaurant;
}
