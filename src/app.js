// index.js
import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routers/usuario-router.js';
import transactionsRouter from './routers/transactions-router.js';
import { connectToDatabase } from './config/database.js';

dotenv.config();

async function main() {
  try {
    await connectToDatabase();

    const app = express();
    app.use(cors());
    app.use(json());

    app.use(authRouter);
    app.use(transactionsRouter);

    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });

  } catch (err) {
    console.error("Erro ao iniciar o servidor:", err);
    process.exit(1); 
  }
}

main();
