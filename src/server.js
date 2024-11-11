import express, { json, urlencoded } from 'express';
import { connectToCollection, disconnect } from './connections/mongo_connections_db.js';
import { createRestaurant } from './utils/createRestaurant.js';
import { BOROUGHS, CUISINES } from './data/fields.js';

const server = express();
server.use(json());
server.use(urlencoded({ extended: true }));

// Obtener todos los registros de los restaurantes método GET, url de ejemplo (http://127.0.0.1:3005/api/v1/restaurantes)
server.get('/api/v1/restaurantes', async (req, res) => {
    const { borough, cuisine } = req.query;
    try {
        const collection = await connectToCollection('restaurants');
        let query = {};

        if (borough) query.borough = borough;
        if (cuisine) query.cuisine = cuisine;

        const restaurantes = await collection.find(query).sort({ name: 1 }).toArray();
        res.status(200).json({ payload: restaurantes });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Obtener un restaurante específico (método GET), url de ejemplo (http://127.0.0.1:3005/api/v1/restaurantes/40356151)
server.get('/api/v1/restaurantes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const collection = await connectToCollection('restaurants');
        const restaurante = await collection.findOne({ restaurant_id: id });

        if (!restaurante) return res.status(404).json({ message: 'Restaurante no encontrado' });

        res.status(200).json({ payload: restaurante });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Búsqueda geoespacial de restaurantes cercanos url ejemplo (http://localhost:3005/api/v1/restaurants/cerca?longitude=-73.8803827&latitude=40.7643124&maxDistanceKm=5)
server.get('/api/v1/restaurants/cerca', async (req, res) => {
    const { longitude, latitude, maxDistanceKm } = req.query;
    const long = parseFloat(longitude);
    const lat = parseFloat(latitude);
    const maxDistance = parseFloat(maxDistanceKm) * 1000; // Convertir km a metros

    if (isNaN(long) || isNaN(lat) || isNaN(maxDistance)) {
        return res.status(400).json({ message: 'Los parámetros de longitud, latitud y distancia máxima deben ser números válidos.' });
    }

    try {
        const collection = await connectToCollection('restaurants');
        const query = {
            "address.coord": {
                $nearSphere: {
                    $geometry: { type: "Point", coordinates: [long, lat] },
                    $maxDistance: maxDistance
                }
            }
        };

        const nearbyRestaurants = await collection.find(query).toArray();

        if (nearbyRestaurants.length === 0) {
            return res.status(404).json({ message: "No se encontraron restaurantes cercanos." });
        }

        res.status(200).json({ payload: nearbyRestaurants });
    } catch (error) {
        console.error("Error en la consulta geoespacial:", error.message);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

// Ruta para buscar restaurantes por tipo de comida y/o nombre, método GET, url de ejemplo (http://127.0.0.1:3005/api/v1/restaurants/busqueda?cuisine=American)
server.get('/api/v1/restaurant/busqueda', async (req, res) => {
    const { cuisine, name } = req.query;

    try {
        const collection = await connectToCollection('restaurants');

        let query = {};
        if (cuisine) query.cuisine = { $regex: new RegExp(cuisine, 'i') };
        if (name) query.name = { $regex: new RegExp(name, 'i') };

        const restaurantes = await collection.find(query).sort({ name: 1 }).toArray();

        if (restaurantes.length === 0) {
            return res.status(404).json({ message: "No se encontraron restaurantes con los filtros aplicados." });
        }

        res.status(200).json({ payload: restaurantes });
    } catch (error) {
        console.error('Error en la búsqueda:', error.message);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Crear un nuevo restaurante método POST, url de ejemplo (http://localhost:3005/api/v1/restaurantes)
server.post('/api/v1/restaurantes', async (req, res) => {
    const { name, borough, cuisine, address, grades, comments } = req.body;
    if (!name || !borough || !cuisine || !address) return res.status(400).json({ message: 'Faltan datos relevantes' });

    try {
        const collection = await connectToCollection('restaurants');
        const newRestaurant = createRestaurant({
            name,
            borough: BOROUGHS[borough.toUpperCase()],
            cuisine: CUISINES[cuisine.toUpperCase()],
            address,
            grades,
            comments
        });

        await collection.insertOne(newRestaurant);
        res.status(201).json({ message: 'Restaurante creado', payload: newRestaurant });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Actualizar un restaurante método PUT, url de ejemplo (http://127.0.0.1:3005/api/v1/restaurantes/672d36e30dbc61fd13236b6d)
server.put('/api/v1/restaurantes/:id', async (req, res) => {
    const { id } = req.params;
    const { name, borough, cuisine, address, grades } = req.body;

    if (!name || !borough || !cuisine || !address) return res.status(400).json({ message: 'Faltan datos relevantes' });

    try {
        const collection = await connectToCollection('restaurants');
        const result = await collection.findOneAndUpdate(
            { restaurant_id: id },
            { $set: { name, borough, cuisine, address, grades } },
            { returnOriginal: false }
        );

        if (!result.value) return res.status(404).json({ message: 'Restaurante no encontrado' });
        res.status(200).json({ message: 'Restaurante actualizado', payload: result.value });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Eliminar un restaurante método DELETE, url de ejemplo (http://127.0.0.1:3005/api/v1/restaurantes/672d36e30dbc61fd13236b6d)
server.delete('/api/v1/restaurantes/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const collection = await connectToCollection('restaurants');
        const result = await collection.deleteOne({ restaurant_id: id });

        if (!result.deletedCount) return res.status(404).json({ message: 'Restaurante no encontrado' });
        res.status(200).json({ message: 'Restaurante eliminado' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

const PORT = process.env.SERVER_PORT || 3005;
server.listen(PORT, () => {
    console.log(`Ejecutándose en http://localhost:${PORT}/api/v1/restaurantes`);
});
