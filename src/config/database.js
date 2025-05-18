import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const mongoURL = process.env.DATABASE_URL;
const mongoClient = new MongoClient(mongoURL);

async function connectToDatabase() {
    try {
        console.log(`Conectando ao MongoDB na URL: ${mongoURL}`);
        await mongoClient.connect();
        console.log("MongoDB conectado!!!");
    } catch (error) {
        console.error("Erro ao conectar ao MongoDB:", error.message);
        throw error; // Interrompe a execução se a conexão falhar
    }
}

connectToDatabase();

export const db = mongoClient.db();