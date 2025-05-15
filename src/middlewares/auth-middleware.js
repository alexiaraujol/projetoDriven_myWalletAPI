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
        jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => {
            if (error) {
                return res.sendStatus(401);
            }


            const usuario = await db.collection("usuarios").findOne({
                _id: new ObjectId(decoded.userId)
            });
            if (!usuario) return res.sendStatus(401);

            res.locals.usuario = usuario;

            return next();


        });

    } catch (error) {
        return res.sendStatus(500);

    }
}