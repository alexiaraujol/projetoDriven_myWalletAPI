import { Router } from "express";
import { signIn, signUp } from '../controller/usuarios-controller.js';
import { validarSchema } from "../middlewares/schema-middleware.js";
import { usuarioLoginSchema, usuarioSchema } from "../schema/authschema.js";

const authRouter = Router();

authRouter.post("/sign-up",validarSchema(usuarioSchema), signUp);
authRouter.post("/sign-in", validarSchema(usuarioLoginSchema),signIn);

export default authRouter;