import { restaurantsData } from '../data/data.js';

// Función para cargar los datos desde el archivo de datos
export async function loadRestaurantsData() {
    return restaurantsData; // Devuelve los datos directamente
}

// Simulación de desconexión
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
    const index = restaurantsData.findIndex(r => r.restaurant_id === id);

    if (index === -1) {
        return null; // Restaurante no encontrado
    }

    restaurantsData[index] = { ...restaurantsData[index], ...newData };
    return restaurantsData[index];
}

// Función para eliminar un restaurante
export async function deleteRestaurant(id) {
    const index = restaurantsData.findIndex(r => r.restaurant_id === id);

    if (index === -1) {
        return null; // Restaurante no encontrado
    }

    const deletedRestaurant = restaurantsData.splice(index, 1)[0];
    return deletedRestaurant;
}
