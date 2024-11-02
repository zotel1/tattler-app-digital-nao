import express, { json, urlencoded } from 'express';
import { desconnect, load, loadRestaurantsData } from './connections/local_connections_db.js';

const server = express();

const messageNotFount = JSON.stringify({ message: 'No hay ningún restaurante registrado con ese nombre.' });
const messageMissingData = JSON.stringify({ message: 'Faltan datos relevantes.' });
const messageErrorServer = JSON.stringify({ message: 'Se ha generadp un error en el servidor.'});

//Middlewares
server.use(json());
server.use(urlencoded({ extended: true }));

// Obtener todos los registros de los restaurantes disponibles(método GET)
server.get('/api/v1/restaurantes', async (req, res) => {
    const { borough, cuisine } = req.query;
    try {
        let restaurantes =await loadRestaurantsData();

        // filtrar por borough o cuisine, o devolver todos los restaurantes
        if (borough) {
            restaurantes = restaurantes.filter(restaurant => restaurant.borough === borough);
        } else if (cuisine) {
            restaurantes = restaurantes.filter(restaurant => restaurant.cuisine === cuisine);
        }

        res.status(200).send(JSON.stringify({ payload: restaurantes }));
    } catch (error) {
        console.log(error.message);
        res.status(500).send(messageErrorServer);
    }
});


// Obtener un restaurante específico (método GET)
server.get('/api/v1/restaurantes/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const restaurantes = await loadRestaurantsData();
        const restaurante = restaurantes.find(r => r.restaurant_id == id);

        if (!restaurante) return res.status(400).send(messageNotFount);

        res.status(200).send(JSON.stringify({ payload: restaurante }));
    } catch (error) {
        console.log(error.message);
        res.status(500).send(messageErrorServer);
    }
});

