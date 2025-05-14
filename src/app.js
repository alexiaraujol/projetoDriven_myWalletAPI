import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { deleteTransactions, getTransactions, postTransactions, putTransactions } from './transactions.js';
import { signUp, singnIn } from './usuarios.js';
dotenv.config();

//criando a Api
const app = express();
app.use(cors());
app.use(json());

//rota para cadastro de usuario
app.post("/sign-up", signUp);
app.post("/sign-in", singnIn);

app.post("/transactions", postTransactions);
app.get("/transactions", getTransactions);
app.delete("/transactions/:id", deleteTransactions);
app.put("/transactions/:id", putTransactions);



app.listen(5000, () => {
    console.log("Servidor rodando na porta 5000");
});