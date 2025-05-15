import { Router } from "express";
import { signUp, singnIn } from '../controller/usuarios-controller.js';
import { validarSchema } from "../middlewares/schema-middleware.js";
import { usuarioLoginSchema, usuarioSchema } from "../schema/authschema.js";

const authRouter = Router();

//rota para cadastro de usuario
authRouter.post("/sign-up",validarSchema(usuarioSchema), signUp);
authRouter.post("/sign-in", validarSchema(usuarioLoginSchema),singnIn);

export default authRouter;