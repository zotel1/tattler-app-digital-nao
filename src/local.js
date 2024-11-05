import express, { json, urlencoded } from 'express';
import { desconnect, generateCodigo, loadRestaurantsData, updateRestaurant, deleteRestaurant } from './connections/local_connections_db.js';
import fs from 'fs/promises';
import path from 'path';

const server = express();

const messageNotFound = JSON.stringify({ message: 'No hay ningún restaurante registrado con ese nombre.' });
const messageMissingData = JSON.stringify({ message: 'Faltan datos relevantes.' });
const messageErrorServer = JSON.stringify({ message: 'Se ha generado un error en el servidor.' });

// Middlewares
server.use(json());
server.use(urlencoded({ extended: true }));

// Ruta para obtener todos los registros de restaurantes (método GET)
server.get('/api/v1/restaurantes', async (req, res) => {
    const { borough, cuisine } = req.query;
    try {
        let restaurantes = await loadRestaurantsData();

        // Filtrar por borough o cuisine, o devolver todos los restaurantes
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

// Ruta para obtener un restaurante específico (método GET)
server.get('/api/v1/restaurantes/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const restaurantes = await loadRestaurantsData();
        const restaurante = restaurantes.find(r => r.restaurant_id === id);

        if (!restaurante) return res.status(400).send(messageNotFound);

        res.status(200).send(JSON.stringify({ payload: restaurante }));
    } catch (error) {
        console.log(error.message);
        res.status(500).send(messageErrorServer);
    }
});

// Ruta para crear un nuevo restaurante (método POST)
server.post('/api/v1/restaurantes', async (req, res) => {
    const { name, borough, cuisine, address, grades } = req.body;

    if (!name || !borough || !cuisine || !address) return res.status(400).send(messageMissingData);

    try {
        const restaurantes = await loadRestaurantsData();
        const newId = await generateCodigo(restaurantes);

        const restaurante = {
            restaurant_id: newId,
            name,
            borough,
            cuisine,
            address,
            grades: grades || []
        };

        restaurantes.push(restaurante);

        const dataPath = path.join(process.cwd(), 'src', 'data', 'data.json');
        await fs.writeFile(dataPath, JSON.stringify(restaurantes, null, 2));
        res.status(201).send(JSON.stringify({ message: 'Restaurante creado', payload: restaurante }));
    } catch (error) {
        console.log(error.message);
        res.status(500).send(messageErrorServer);
    }
});

// Ruta para actualizar un restaurante (método PUT)
server.put('/api/v1/restaurantes/:id', async (req, res) => {
    const { id } = req.params;
    const { name, borough, cuisine, address, grades } = req.body;

    if (!name || !borough || !cuisine || !address) return res.status(400).send(messageMissingData);

    try {
        const updatedRestaurant = await updateRestaurant(id, { name, borough, cuisine, address, grades });

        if (!updatedRestaurant) {
            return res.status(404).send(messageNotFound);
        }

        res.status(200).send(JSON.stringify({ message: 'Restaurante actualizado', payload: updatedRestaurant }));
    } catch (error) {
        console.log(error.message);
        res.status(500).send(messageErrorServer);
    }
});

// Ruta para eliminar un restaurante (método DELETE)
server.delete('/api/v1/restaurantes/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedRestaurant = await deleteRestaurant(id);

        if (!deletedRestaurant) {
            return res.status(404).send(messageNotFound);
        }

        res.status(200).send(JSON.stringify({ message: 'Restaurante eliminado', payload: deletedRestaurant }));
    } catch (error) {
        console.log(error.message);
        res.status(500).send(messageErrorServer);
    }
});

// Método oyente de solicitudes
server.listen(process.env.SERVER_PORT || 3005, () => {
    console.log(`Ejecutandose en http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/api/v1/restaurantes`);
});
