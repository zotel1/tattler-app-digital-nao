import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

let db = null;

async function connectToDatabase() {
    try {
        if (!db) {
            await client.connect();
            console.log('🔌 Conectado a MongoDB');
            db = client.db(process.env.DATABASE_NAME); // Nombre de la base de datos en MongoDB Atlas
        }
        return db;
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error.message);
        throw new Error('No se pudo conectar a la base de datos');
    }
}

export async function connectToCollection(collectionName) {
    const database = await connectToDatabase();
    return database.collection(collectionName);
}

export async function disconnect() {
    try {
        await client.close();
        console.log('🔌 Desconectado de MongoDB');
    } catch (error) {
        console.error('Error al desconectar de MongoDB:', error.message);
    }
}

export async function generateCodigo(collection) {
    const documentMaxCodigo = await collection.find().sort({ restaurant_id: -1 }).limit(1).toArray();
    const maxCodigo = documentMaxCodigo[0]?.restaurant_id ?? 0;
    return (parseInt(maxCodigo) + 1).toString(); // Asegúrate de devolver un string
}


const client = new MongoClient(process.env.DATABASE_URL);

async function connect() {
    let connection = null;
    console.log('Conectando...');

    try {
        connection = await client.connect();
        console.log('🔌 Conectando');
    } catch (error) {
        console.log(error.message);
    }

    return connection;
}

export async function desconnect() {
    try {
        await client.close();
        console.log('🔌 Desconectado');
    } catch (error) {
        console.log(error.message);
    }
}

export async function connectToCollection(collectionName) {
    const connection = await connect();
    const db = connection.db(process.env.DATABASE_NAME);
    const collection = db.collection(collectionName);

    return collection;
}

export async function generateCodigo(collection) {
    const documentMaxCodigo = await collection.find().sort({ id: -1 }).limit(1).toArray();
    const maxCodigo = documentMaxCodigo[0]?.id ?? 0;

    return maxCodigo + 1;
}