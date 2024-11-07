import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import transformedData from './transformedData.js';

dotenv.config();

const client = new MongoClient(process.env.DATABASE_URL);

async function seedDatabase() {
    try {
        await client.connect();
        console.log('Conectado a MongoDB Atlas');

        const db = client.db(process.env.DATABASE_NAME);
        const collection = db.collection('restaurants'); // Debemos de asegurarnos de que el nombre coincida

        const result = await collection.insertMany(transformedData);
        console.log(`${result.insertedCount} documentos insertados`);
    } catch (error) {
        console.error('Error insertando los datos:', error.message);
    } finally {
        await client.close();
        console.log('Desconectado de MongoDB Atlas');
    }
}

// Ejecutar la función para insertar los datos
seedDatabase();