import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routers/usuario-router.js';
import transactionsRouter from './routers/transactions-router.js';
dotenv.config();

//criando a Api
const app = express();
app.use(cors());
app.use(json());

app.use(authRouter);
app.use(transactionsRouter);


const porta = process.env.PORT || 5000;
app.listen(porta, () => {
console.log( `Servidor rodando na porta ${porta}`);
});