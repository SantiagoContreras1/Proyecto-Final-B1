import { body } from "express-validator";
import { validarCampos } from "./validar-campos.js";
import { existEmail } from "../helpers/db-validator.js";

export const registerValidator = [
    body('username').not().isEmpty().withMessage('El username es obligatorio'),
    body("email",'Ingresa un email pelotudo').not().isEmpty(),
    body('email').custom(existEmail),
    body('password').not().isEmpty().withMessage('El password es obligatorio'),
    validarCampos
]

export const loginValidator =[
    body('email').optional().isEmail().withMessage('Ingresa un email válido'),
    body('password').not().isEmpty().withMessage('El password es obligatorio'),
    validarCampos
]