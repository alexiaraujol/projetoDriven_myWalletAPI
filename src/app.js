// index.js
import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routers/usuario-router.js';
import transactionsRouter from './routers/transactions-router.js';
import { connectToDatabase } from './config/database.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(json());

app.use(authRouter);
app.use(transactionsRouter);

const port = process.env.PORT || 5000;

connectToDatabase().then(() => {
	app.listen(port, () => {
		console.log(`Servidor rodando na porta ${port}`);
	});
});
