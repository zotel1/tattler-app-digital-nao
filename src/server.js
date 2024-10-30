import express, {json, urlencoded} from 'express';
// eslint-dosable-next-line sort-imports

import { desconnect, connectToCollection, generateCodigo } from '../connection_db.js';
import { Collection } from 'mongodb';

const server = express();

const messageNotFound = JSON.stringify({ message: 'No hay ningun restaurante registrado con ese nombre.' });
const messageMissingData = JSON.stringify({ message: 'Faltan datos relevantes.' });
const messageErrorServer = JSON.stringify({ message: 'Se ha generado un error en el servidor.'});

// Middlewares
server.use(json());
server.use(urlencoded({ extended: true }));

// Obtener todos los registros de los restaurantes disponibles (metodo GET): Ruta GET http://127.0.0.1:3005/api/v1/restaurantes
server.get('/api/v1/restaurantes', async (req, res) => {
    const { borough, cuisine } = req.query;
    let restaurantes = [];

    try { const collection = await connectToCollection('restaurantes');

        // Filtrar por borough o cuisine, o devolver todos los restaurantes
        if ( borough) {
            restaurantes = awair collection.find({ borough }).sort({ name: 1 }).toArray();
        } else if (cuisine){
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

// Obtener un restaurante específico (metodo GET): Ruta GET http://127.0.0.1:3005/api/v1/restaurantes/:restaurant_id
server.get('/api/v1/restaurantes/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const collesction = await connectToCollection('restaurantes');
        const restaurante = await collection.findOne({ id: { $eq: id }});

        if (!restaurante) return res.status(400).send(messageNotFound);

        res.status(200).send(JSON.stringify({ payload: restaurante }));
    } catch (error) {
        console.log(error.message);
        res.status(500).send(messageErrorServer);
    } finally {
        await desconnect();
    }
});

// Crear un nuevo restaurante (metodo POST): Ruta POST http://127.0.0.1:3005/api/v1/restaurantes
server.post('/api/v1/restaurantes', async (req, res) => {
    const { name, borough, cuisine, address, grades } = req.body;

    if (!name || !borough || !cuisine || !address) return res.status(400).send(messageMissingData);

    try {
        const collection = await connectToCollection('restaurantes');
        const restaurante = {
            id : await generateCodigo(collection),
            name, 
            borough,
            cuisine,
            address,
            grades: grades || []
        };

        await collection.insertOne(restaurante);
        res.status(201).send(JSON.stringify({ message: 'Restaurante creado', payload: restaurante}));
    } catch (error) {
        console.log(error.message);
        res.statuus(500).send(messageErrorServer);
    } finally {
        await desconnect();
    }
});

// Actualizar un restaurante (METODO PUT): Ruta PUT http://127.0.0.1:3005/api/v1/restaurantes/:restaurant_id
server.put('/api/v1/restaurantes/:id', async (req, res) => {
    
    const { id } = req.params;
    const { name, borough, cuisine, address } = req.body;

    if (!name || !borough || !cuisine || !address ) return res.status(400).send(messageMissingData);

    try {
        const collection = await connectToCollection('restaurantes');
        let restaurante = await collection.findOne({ id : { $eq: id }});

        if (!restaurante) return res.status(400).send(messageNotFound);

        restaurante = { name, borough, cuisine, address };

        await collection.updateOne({ id }, { $set: restaurante });
        return res.status(200).send(JSON.stringify({message: 'Restaurante actualizado', payload: { id, ...restaurante } }));
    } catch (error) {
        console.log(error.message);
        res.status(500).send(messageErrorServer);
    } finally {
        await desconnect();
    }
});



// Método oyente de solicitudes
server.listen(process.env.SERVER_PORT, process.env.SERVEROST, () => {
    console.log(`Ejecutandose en http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/api/v1/restaurantes`);
});
