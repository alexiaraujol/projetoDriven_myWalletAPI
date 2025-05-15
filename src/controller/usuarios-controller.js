
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';


import { usuarioLoginSchema, usuarioSchema } from "../schema/authschema.js";
import { db } from "../config/database.js";



export async function signUp (req, res)  {
    //pegar as infs do usuario 
    const usuario = req.body;
    //validar as infs



    //salvar no banco 
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


};


export async function singnIn (req, res)  {


    const usuario = req.body;




    try {
        const usuarioCadastrado = await db.collection("usuarios").findOne({
            email: usuario.email
        });

        if (!usuarioCadastrado) {
            return res.status(404).send("Usuario não encontrado")

        }

        if (usuarioCadastrado && bcrypt.compareSync(usuario.password, usuarioCadastrado.password)) {
            console.log("Usuario logado com sucesso!!")

            const token = uuidv4();

            const sessao = {
                token,
                userId: usuarioCadastrado._id
            };

            await db.collection("sessoes").insertOne(sessao);

            return res.send(token);
        }

        return res.status(401).send("usuario e senha incompativeis");

    } catch (error) {
        return res.status(500).send(error.message);
    }


};