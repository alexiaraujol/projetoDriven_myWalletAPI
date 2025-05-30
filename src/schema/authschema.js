import Joi from "joi";

export const usuarioSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

export const usuarioLoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});