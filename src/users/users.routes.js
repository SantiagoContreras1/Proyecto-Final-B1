import { Router } from "express";
import { check } from "express-validator";
import {validarJWT} from "../middlewares/validar-JWT.js"
import {validarCampos} from "../middlewares/validar-campos.js"
import {existentUserById} from "../helpers/db-validator.js"
import { getUsers,updateUser,deleteUser } from "./users.controller.js";

const router = Router()

router.get(
    "/",
    getUsers
)

router.put(
    "/update/:id",
    [
        validarJWT,
        check("id", "Ingresa un id valido para mongo").isMongoId(),
        check("id").custom(existentUserById),
        validarCampos
    ],
    updateUser
)

router.delete(
    "/delete/:id",
    [
        validarJWT,
        check("id", "Ingresa un id valido para mongo").isMongoId(),
        check("id").custom(existentUserById),
        validarCampos
    ],
    deleteUser
)

export default router