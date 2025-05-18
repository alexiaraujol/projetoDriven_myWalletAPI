// controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import { getDb } from "../config/database.js"; // ✅ usa função segura

export async function signUp(req, res) {
    const usuario = req.body;
    const db = getDb(); // ✅ pega db com segurança

    const usuarioCadastrado = await db.collection("usuarios").findOne({ email: usuario.email });
    if (usuarioCadastrado) {
        return res.status(409).send("Usuario ja cadastrado");
    }

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
}

export async function signIn(req, res) {
    const usuario = req.body;
    const db = getDb(); // ✅ pega db com segurança

    try {
        const usuarioCadastrado = await db.collection("usuarios").findOne({ email: usuario.email });
        if (!usuarioCadastrado) {
            return res.status(404).send("Usuario não encontrado");
        }

        if (bcrypt.compareSync(usuario.password, usuarioCadastrado.password)) {
            const token = jwt.sign(
                { userId: usuarioCadastrado._id },
                process.env.JWT_SECRET,
                { expiresIn: 86400 }
            );
            return res.send(token);
        }

        return res.status(401).send("usuario e senha incompativeis");
    } catch (error) {
        return res.status(500).send(error.message);
    }
}
