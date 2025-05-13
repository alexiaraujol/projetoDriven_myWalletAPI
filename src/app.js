import express, { json } from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();


import Joi from 'joi';
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import { deleteTransactions, getTransactions, postTransactions, putTransactions } from './transactions';


//criando a Api
const app = express();
app.use(cors());
app.use(json());

const mongoURL = process.env.DATABASE_URL;
const mongoClient = new MongoClient(mongoURL);
let db;

mongoClient.connect()
    .then(() => {
        console.log("MongoDB conectado com sucesso!");
        db = mongoClient.db();
        export db;
    })
    .catch(err => console.log(err.message));




//rota para cadastro de usuario
app.post("/sign-up", async (req, res) => {
    //pegar as infs do usuario 
    const usuario = req.body;
    //validar as infs
    const usuarioSchema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    });

    const validacao = usuarioSchema.validate(usuario, { abortEarly: false })
     if (validacao.error) {
        const mensagens = validacao.error.details.map(detail => detail.message);
        
        return res.status(422).send(mensagens);

    }

    //salvar no banco 
    try {
        await db.collection("usuarios").insertOne({
        ...usuario,
         password: bcrypt.hashSync(usuario.password, 10)
        });
        res.status(201).send("Usuario cadastrado com sucesso");
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
    }
    

});

app.post("/sign-in", async (req, res) => {


    const usuario = req.body;

   const usuarioLoginSchema = Joi.object({
       email: Joi.string().email().required(),
       password: Joi.string().required()
   });

   const validacao = usuarioLoginSchema.validate(usuario, { abortEarly: false })
    if (validacao.error) {
       const mensagens = validacao.error.details.map(detail => detail.message);
       return res.status(422).send(mensagens);
    }

    
    try{
        const usuarioCadastrado = await db.collection("usuarios").findOne({
            email: usuario.email
        });

        if(!usuarioCadastrado){
            return res.status(404).send("Usuario não encontrado")

        } 

        if(usuarioCadastrado && bcrypt.compareSync(usuario.password, usuarioCadastrado.password )){
        console.log("Usuario logado com sucesso!!")

        const token = uuidv4(); 

        const sessao = {
            token,
            userId: usuarioCadastrado._id
        };

        await db.collection("sessoes").insertOne(sessao);

        return res.send(token);
        }

        return res.status(401).send("usuario e senha incompativeis");

    } catch (error) {
        return res.status(500).send(error.message);
    }


});

app.post("/transactions", postTransactions);
app.get("/transactions", getTransactions);
app.delete("/transactions/:id", deleteTransactions);
app.put("/transactions/:id", putTransactions);



app.listen(5000, () => {
    console.log("Servidor rodando na porta 5000");
});