
import Joi from "joi";

import { db } from "./database.js";

export async function postTransactions(req, res) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "").trim();

    if (!token) {
        return res.status(401).send("Token não fornecido");
    }

    try {
        const sessao = await db.collection("sessoes").findOne({ token });

        if (!sessao) {
            return res.status(401).send("Sessão inválida");
        }

        const { value, description, type } = req.body;

        const transactionSchema = Joi.object({
            value: Joi.number().positive().required(),
            description: Joi.string().required(),
            type: Joi.string().valid("deposit", "withdraw").required()
        });

        const validacao = transactionSchema.validate({ value, description, type }, { abortEarly: false });
        if (validacao.error) {
            const mensagens = validacao.error.details.map(detail => detail.message);
            return res.status(422).send(mensagens);
        }

        const novaTransacao = {
            userId: sessao.userId, // Associa a transação ao usuário logado
            value,
            description,
            type,
            date: new Date()
        };

        await db.collection("transactions").insertOne(novaTransacao);
        res.status(201).send("Transação registrada com sucesso!");
    } catch (error) {
        res.status(500).send(error.message);
    }
}




export async function getTransactions (req, res)  {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "").trim();

    if (!token) {
        return res.status(401).send("Token não fornecido");
    }

    try {
        const sessao = await db.collection("sessoes").findOne({ token });

        if (!sessao) {
            return res.status(401).send("Sessão inválida");
        }

        const transactions = await db.collection("transactions").find({ userId: sessao.userId }).toArray();
        res.status(200).send(transactions);
        
        if(!transactions) return res.status(404).send("transações não encontrada");


    } catch (error) {
        res.status(500).send(error.message);
    }
};



export async function putTransactions (req, res)  {
    const { id } = req.params; // ID da transação a ser atualizada
    const novaTransacao = req.body; // Dados atualizados da transação

    try {
        const resultado = await db.collection("transactions").updateOne(
            { _id: new MongoClient.ObjectId(id) }, // Filtro pelo ID
            { $set: novaTransacao } // Atualiza os campos
        );

        if (resultado.matchedCount === 0) {
            return res.status(404).send("Transação não encontrada");
        }

        res.send("Transação atualizada com sucesso");
    } catch (error) {
        res.status(500).send(error.message);
    }
};

export async function deleteTransactions (req, res)  {
    const { id } = req.params; // ID da transação a ser deletada

    try {
        const resultado = await db.collection("transactions").deleteOne({
            _id: new MongoClient.ObjectId(id),
        });

        if (resultado.deletedCount === 0) {
            return res.status(404).send("Transação não encontrada");
        }

        res.send("Transação deletada com sucesso");
    } catch (error) {
        res.status(500).send(error.message);
    }
};