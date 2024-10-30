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

// Método oyente de solicitudes
server.listen(process.env.SERVER_PORT, process.env.SERVEROST, () => {
    console.log(`Ejecutandose en http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/api/v1/restaurantes`);
});
