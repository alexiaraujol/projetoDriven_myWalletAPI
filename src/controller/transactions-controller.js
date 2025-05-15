import { ObjectId } from "mongodb";
import { db } from "../config/database.js";

export async function postTransactions(req, res) {
    try {
        const { value, description, type } = req.body;


        const novaTransacao = {
            userId: req.userId, 
            value,
            description,
            type,
            date: new Date()
        };

        await db.collection("transactions").insertOne(novaTransacao);
        res.status(201).send("Transação registrada com sucesso!");
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno do servidor");
    }
}

export async function getTransactions(req, res) {
    try {
        const transactions = await db.collection("transactions").find({ userId: req.userId }).toArray();

        if (!transactions || transactions.length === 0) {
            return res.status(404).send("Transações não encontradas");
        }

        res.status(200).send(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno do servidor");
    }
}

export async function putTransactions(req, res) {
    const { id } = req.params;
    const novaTransacao = req.body;

    if (!ObjectId.isValid(id)) {
        return res.status(400).send("ID inválido");
    }

    try {
        const resultado = await db.collection("transactions").updateOne(
            { _id: new ObjectId(id) },
            { $set: novaTransacao }
        );

        if (resultado.matchedCount === 0) {
            return res.status(404).send("Transação não encontrada");
        }

        res.send("Transação atualizada com sucesso");
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno do servidor");
    }
}

export async function deleteTransactions(req, res) {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(400).send("ID inválido");
    }

    try {
        const resultado = await db.collection("transactions").deleteOne({
            _id: new ObjectId(id),
        });

        if (resultado.deletedCount === 0) {
            return res.status(404).send("Transação não encontrada");
        }

        res.send("Transação deletada com sucesso");
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno do servidor");
    }
}