import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const client = new MongoClient(process.env.DATABASE_URL);
let db = null;

// Conexión a MongoDB Atlas solo una vez
async function connectToDatabase() {
    try {
        if (!db) {
            await client.connect();
            console.log('🔌 Conectado a MongoDB Atlas');
            db = client.db(process.env.DATABASE_NAME);

            // Crear índice geoespacial en `address.coord` si no existe
            const collection = db.collection('restaurants');
            await collection.createIndex({ "address.coord": "2dsphere" });
            console.log('Índice geoespacial 2dsphere en `address.coord` creado o verificado');
        }
        return db;
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error.message);
        throw new Error('No se pudo conectar a la base de datos');
    }
}

// Función para obtener una colección específica
export async function connectToCollection(collectionName) {
    const database = await connectToDatabase();
    return database.collection(collectionName);
}

// Desconectar de MongoDB (opcional)
export async function disconnect() {
    try {
        await client.close();
        console.log('🔌 Desconectado de MongoDB Atlas');
    } catch (error) {
        console.error('Error al desconectar de MongoDB:', error.message);
    }
}
