import { ObjectId } from "mongodb";
import { db } from "../config/database.js";

export async function postTransactions(req, res) {
    try {
        const { value, description, type } = req.body;


        const novaTransacao = {
            userId: req.userId, 
            description,
            type,
            date: new Date(),
        };

        await db.collection("transactions").insertOne(novaTransacao);
        res.status(201).send("Transação registrada com sucesso!");
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno do servidor");
    }
}

export async function getTransactions(req, res) {
    const pagina = parseInt(req.query.pagina) || 1;  // garantir que seja número
    const limite = 10;
    const inicio = (pagina - 1) * limite;
  
    try {
      // Conta total de transações do usuário
      const total = await db.collection("transactions").countDocuments({ userId: req.userId });
  
      if (total === 0) {
        return res.status(404).send("Transações não encontradas");
      }
  
      // Busca as transações com skip e limit
      const transactions = await db.collection("transactions")
        .find({ userId: req.userId })
        .sort({ date: -1 })
        .skip(inicio)
        .limit(limite)
        .toArray();
  
      // Calcula total de páginas
      const totalPaginas = Math.ceil(total / limite);
  
      // Responde com dados + info da paginação
      res.status(200).json({
        paginaAtual: pagina,
        totalPaginas,
        totalTransacoes: total,
        transacoes: transactions
      });
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