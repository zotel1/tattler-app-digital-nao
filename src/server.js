import express, { json, urlencoded } from 'express';
import { connectToCollection, disconnect } from './connections/mongo_connections_db.js';
import { createRestaurant } from './utils/createRestaurant.js';
import { BOROUGHS, CUISINES } from './data/fields.js';

const server = express();

server.use(json());
server.use(urlencoded({ extended: true }));

// Obtener todos los registros de los restaurantes (método GET)
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

// Obtener un restaurante específico (método GET)
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

// Crear un nuevo restaurante (método POST)
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

// Actualizar un restaurante (método PUT)
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

// Eliminar un restaurante (método DELETE)
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

// Método oyente de solicitudes
const PORT = process.env.SERVER_PORT || 3005;
server.listen(PORT, () => {
    console.log(`Ejecutándose en http://localhost:${PORT}/api/v1/restaurantes`);
});