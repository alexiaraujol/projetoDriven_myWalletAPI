import { Router } from "express";
import { deleteTransactions, getTransactions, postTransactions, putTransactions } from '../controller/transactions-controller.js';

const transactionsRouter = Router();

transactionsRouter.post("/transactions", postTransactions);
transactionsRouter.get("/transactions", getTransactions);
transactionsRouter.delete("/transactions/:id", deleteTransactions);
transactionsRouter.put("/transactions/:id", putTransactions);

export default transactionsRouter;