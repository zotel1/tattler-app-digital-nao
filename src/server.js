import express, { json, urlencoded } from 'express';
import { disconnect, connectToCollection, generateCodigo } from './connections/mongo_connections_db.js';

const server = express();

const messageNotFound = { message: 'No hay ningún restaurante registrado con ese nombre.' };
const messageMissingData = { message: 'Faltan datos relevantes.' };
const messageErrorServer = { message: 'Se ha generado un error en el servidor.' };

// Middlewares
server.use(json());
server.use(urlencoded({ extended: true }));

// Obtener todos los registros de los restaurantes disponibles (método GET)
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
        res.status(500).json(messageErrorServer);
    }
});

// Obtener un restaurante específico (método GET)
server.get('/api/v1/restaurantes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const collection = await connectToCollection('restaurants');
        const restaurante = await collection.findOne({ restaurant_id: id });

        if (!restaurante) return res.status(404).json(messageNotFound);

        res.status(200).json({ payload: restaurante });
    } catch (error) {
        console.error(error.message);
        res.status(500).json(messageErrorServer);
    }
});

// Crear un nuevo restaurante (método POST)
server.post('/api/v1/restaurantes', async (req, res) => {
    const { name, borough, cuisine, address, grades } = req.body;

    if (!name || !borough || !cuisine || !address) return res.status(400).json(messageMissingData);

    try {
        const collection = await connectToCollection('restaurants');
        const newRestaurantId = await generateCodigo(collection);

        const restaurante = {
            restaurant_id: newRestaurantId,
            name,
            borough,
            cuisine,
            address,
            grades: grades || []
        };

        await collection.insertOne(restaurante);
        res.status(201).json({ message: 'Restaurante creado', payload: restaurante });
    } catch (error) {
        console.error(error.message);
        res.status(500).json(messageErrorServer);
    }
});

// Actualizar un restaurante (método PUT)
server.put('/api/v1/restaurantes/:id', async (req, res) => {
    const { id } = req.params;
    const { name, borough, cuisine, address, grades } = req.body;

    if (!name || !borough || !cuisine || !address) return res.status(400).json(messageMissingData);

    try {
        const collection = await connectToCollection('restaurants');
        const result = await collection.findOneAndUpdate(
            { restaurant_id: id },
            { $set: { name, borough, cuisine, address, grades } },
            { returnOriginal: false }
        );

        if (!result.value) return res.status(404).json(messageNotFound);
        res.status(200).json({ message: 'Restaurante actualizado', payload: result.value });
    } catch (error) {
        console.error(error.message);
        res.status(500).json(messageErrorServer);
    }
});

// Eliminar un restaurante (método DELETE)
server.delete('/api/v1/restaurantes/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const collection = await connectToCollection('restaurants');
        const result = await collection.deleteOne({ restaurant_id: id });

        if (!result.deletedCount) return res.status(404).json(messageNotFound);
        res.status(200).json({ message: 'Restaurante eliminado' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json(messageErrorServer);
    }
});

// Control de rutas inexistentes
server.use('*', (req, res) => {
    res.status(404).send(`<h1>Error 404</h1><h3>La URL indicada no existe en el servidor</h3>`);
});

// Método oyente de solicitudes
const PORT = process.env.SERVER_PORT || 3005;
server.listen(PORT, () => {
    console.log(`Ejecutándose en http://localhost:${PORT}/api/v1/restaurantes`);
});
