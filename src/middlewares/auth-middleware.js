import jwt from "jsonwebtoken";
import { db } from "../config/database.js";
import dotenv from "dotenv";
import { ObjectId } from "mongodb";
dotenv.config();

export async function validarToken(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "").trim();

    if (!token) return res.sendStatus(401); 

    try {
        console.log("JWT_SECRET usado no middleware:", process.env.JWT_SECRET);
        console.log("Token recebido:", token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        console.log("Decoded:", decoded);
        const usuario = await db.collection("usuarios").findOne({
            _id: new ObjectId(decoded.userId),
        });
        console.log("Usuário encontrado:", usuario);

        if (!usuario) return res.sendStatus(401); 

        req.userId = usuario._id; 
        next();
    } catch (error) {
        console.error(error);
        return res.sendStatus(401);
    }
}