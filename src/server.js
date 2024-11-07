import express, { json, urlencoded } from 'express';
// eslint-disable-next-line sort-imports

import { desconnect, connectToCollection, generateCodigo } from './connections/mongo_connections_db.js';

const server = express();

const messageNotFound = JSON.stringify({ message: 'No hay ningún restaurante registrado con ese nombre.' });
const messageMissingData = JSON.stringify({ message: 'Faltan datos relevantes.' });
const messageErrorServer = JSON.stringify({ message: 'Se ha generado un error en el servidor.' });

// Middlewares
server.use(json());
server.use(urlencoded({ extended: true }));

// Obtener todos los registros de los restaurantes disponibles (método GET)
server.get('/api/v1/restaurantes', async (req, res) => {
    const { borough, cuisine } = req.query;
    let restaurantes = [];

    try {
        const collection = await connectToCollection('restaurantes');

        if (borough) {
            restaurantes = await collection.find({ borough }).sort({ name: 1 }).toArray();
        } else if (cuisine) {
            restaurantes = await collection.find({ cuisine }).sort({ name: 1 }).toArray();
        } else {
            restaurantes = await collection.find().toArray();
        }

        res.status(200).send(JSON.stringify({ payload: restaurantes }));
    } catch (error) {
        console.log(error.message);
        res.status(500).send(messageErrorServer);
    } finally {
        await desconnect();
    }
});

// Obtener un restaurante específico (método GET)
server.get('/api/v1/restaurantes/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const collection = await connectToCollection('restaurantes');
        const restaurante = await collection.findOne({ id: { $eq: id } });

        if (!restaurante) return res.status(400).send(messageNotFound);

        res.status(200).send(JSON.stringify({ payload: restaurante }));
    } catch (error) {
        console.log(error.message);
        res.status(500).send(messageErrorServer);
    } finally {
        await desconnect();
    }
});

// Crear un nuevo restaurante (método POST)
server.post('/api/v1/restaurantes', async (req, res) => {
    const { name, borough, cuisine, address, grades } = req.body;

    if (!name || !borough || !cuisine || !address) return res.status(400).send(messageMissingData);

    try {
        const collection = await connectToCollection('restaurantes');
        const restaurante = {
            id: await generateCodigo(collection),
            name,
            borough,
            cuisine,
            address,
            grades: grades || []
        };

        await collection.insertOne(restaurante);
        res.status(201).send(JSON.stringify({ message: 'Restaurante creado', payload: restaurante }));
    } catch (error) {
        console.log(error.message);
        res.status(500).send(messageErrorServer);
    } finally {
        await desconnect();
    }
});


// Actualizar un restaurante (método PUT)
server.put('/api/v1/restaurantes/:id', async (req, res) => {
    const { restaurant_id } = req.params;
    const { name, borough, cuisine, address } = req.body;

    if (!name || !borough || !cuisine || !address) return res.status(400).send(messageMissingData);

    try {
        const collection = await connectToCollection('restaurantes');
        let restaurante = await collection.findOne({ restaurant_id: { $eq: restaurant_id } });

        if (!restaurante) return res.status(400).send(messageNotFound);

        restaurante = { name, borough, cuisine, address };

        await collection.updateOne({ restaurant_id }, { $set: restaurante });
        return res.status(200).send(JSON.stringify({ message: 'Restaurante actualizado', payload: { id, ...restaurante } }));
    } catch (error) {
        console.log(error.message);
        res.status(500).send(messageErrorServer);
    } finally {
        await desconnect();
    }
});

// Eliminar un restaurante (método DELETE)
server.delete('/api/v1/restaurantes/:id', async (req, res) => {
    const { restaurant_id } = req.params;

    try {
        const collection = await connectToCollection('restaurantes');
        const restaurante = await collection.findOne({ restaurant_id: { $eq: restaurant_id } });

        if (!restaurante) return res.status(400).send(messageNotFound);

        await collection.deleteOne({ id });
        res.status(200).send(JSON.stringify({ message: 'Restaurante eliminado', payload: { id, ...restaurante } }));
    } catch (error) {
        console.log(error.message);
        res.status(500).send(messageErrorServer);
    } finally {
        await desconnect();
    }
});

// Control de rutas inexistentes
server.use('*', (req, res) => {
    res.status(404).send(`<h1>Error 404</h1><h3>La URL indicada no existe en el servidor</h3>`);
});

// Método oyente de solicitudes
server.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, () => {
    console.log(`Ejecutándose en http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/api/v1/restaurantes`);
});