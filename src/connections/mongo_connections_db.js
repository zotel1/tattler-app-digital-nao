import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const client = new MongoClient(process.env.DATABASE_URL);
let db = null;

// Función para conectar a la base de datos solo una vez
async function connectToDatabase() {
    try {
        if (!db) {
            await client.connect();
            console.log('🔌 Conectado a MongoDB Atlas');
            db = client.db(process.env.DATABASE_NAME);
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

// Función para desconectar de MongoDB
export async function disconnect() {
    try {
        await client.close();
        console.log('🔌 Desconectado de MongoDB Atlas');
    } catch (error) {
        console.error('Error al desconectar de MongoDB:', error.message);
    }
}

// Generar un nuevo código para un restaurante
export async function generateCodigo(collection) {
    const documentMaxCodigo = await collection.find().sort({ restaurant_id: -1 }).limit(1).toArray();
    const maxCodigo = documentMaxCodigo[0]?.restaurant_id ?? 0;
    return (parseInt(maxCodigo) + 1).toString(); // Asegúrate de devolver un string
}
