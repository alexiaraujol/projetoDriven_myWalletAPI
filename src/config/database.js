// config/database.js
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const mongoURL = process.env.DATABASE_URL;
const mongoClient = new MongoClient(mongoURL);
let db;

async function connectToDatabase() {
    try {
        console.log(`Conectando ao MongoDB na URL: ${mongoURL}`);
        await mongoClient.connect();
        db = mongoClient.db(); // só define db depois da conexão
        console.log("MongoDB conectado!!!");
    } catch (error) {
        console.error("Erro ao conectar ao MongoDB:", error.message);
    }
}

function getDb() {
    if (!db) throw new Error("DB não conectado ainda.");
    return db;
}

export { connectToDatabase, getDb };
