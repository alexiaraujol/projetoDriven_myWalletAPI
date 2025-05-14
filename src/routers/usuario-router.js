import { Router } from "express";
import { signUp, singnIn } from '../controller/usuarios-controller.js';

const authRouter = Router();

//rota para cadastro de usuario
authRouter.post("/sign-up", signUp);
authRouter.post("/sign-in", singnIn);

export default authRouter;