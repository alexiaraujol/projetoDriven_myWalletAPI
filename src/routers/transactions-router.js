import { Router } from "express";
import { deleteTransactions, getTransactions, postTransactions, putTransactions } from '../controller/transactions-controller.js';
import { validarToken } from "../middlewares/auth-middleware.js";
import { validarSchema } from "../middlewares/schema-middleware.js";
import { transactionSchema } from "../schema/transactions.js";

const transactionsRouter = Router();

transactionsRouter.use(validarToken);
transactionsRouter.post("/transactions",validarSchema(transactionSchema), postTransactions);
transactionsRouter.get("/transactions", getTransactions);
transactionsRouter.delete("/transactions/:id", deleteTransactions);
transactionsRouter.put("/transactions/:id", validarSchema(transactionSchema), putTransactions);

export default transactionsRouter;