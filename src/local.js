import express, { json, urlencoded } from 'express';
import { desconnect, generateCodigo, loadRestaurantsData, updateRestaurant, deleteRestaurant, updateRestaurant, deleteRestaurant } from './connections/local_connections_db.js';

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
        let restaurantes = await loadRestaurantsData();

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

// crear un nuevo restaurante (método POST)
server.post('/api(v1/restaurantes', async (req, res) => {
    const { name, borough, cuisine, address, grades } = req.body;

    if (!name || !borough || !cuisine || !address || !grades ) return res.status(400).send(messageMissingData);

    try {
        const restaurantes = await loadRestaurantsData();
        const newId = await generateCodigo(restaurantes);

        const restaurante = {
            restaurant_id: 
            newId,
            name,
            borough,
            cuisine,
            address,
            grades: grades || []
        };

        restaurantes.push(restaurante);

        await fs.writeFile (path.join(__dirname, 'data', 'data.json'), JSON.stringify(restaurante, null, 2));
        res.status(201).send(JSON.stringify({ message: 'Restaurante creado', payload: restaurante }));
    } catch (error) {
        console.log(error.message);
        res.status(500).send(messageErrorServer);
    }
});

// Actualizar un restaurante (método PUT)
server.put('/api/v1/restaurantes/:id', async (req, res) => {
    const { id } = req.params;
    const { name, borough, cuisine, address, grades } = req.body;

    if (!name || !borough || !cuisine || !address) return res.status(400).send(messageMissingData);

    try {
        const updateRestaurant = await updateRestaurant(id, {name, borough, cuisine, address, grades });

        if (!updateRestaurant) {
            return res.status(404).send(messageNotFount);
        }

        res.status(200).send(JSON.stringify({ message: 'Restaurante actualizado', payload: updateRestaurant }));
    } catch (error) {
        console.log(error.message);
        res.status(500).send(messageErrorServer);
    }
});

// Eliminar un restaurante (método DELETE)
server.delete('/api/v1/restaurantes/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deleteRestaurant = await deleteRestaurant(id);

        if (!deleteRestaurant) {
            return res.status(404).send(messageNotFount);
        }

        res.status(200).send(JSON.stringify({ message: 'Restaurante eliminado', payload: deleteRestaurant }));
    } catch (error) {
        console.log(error.message);
        res.status(500).send(messageErrorServer);
    }
});

// Método oyente de solicitudes
server.listen(procces.env.SERVER_PORT || 3005, () => {
    console.log(`Server running on port ${process.env.SERVER_PORT || 3005}`);
});



