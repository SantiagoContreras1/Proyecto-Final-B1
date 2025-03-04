import { Router } from "express";
import { check } from "express-validator";
import {validarCampos} from "../middlewares/validar-campos.js"
import { validarJWT } from "../middlewares/validar-JWT.js"
import { addToCar,getCar,deleteCar, deleteProduct } from "./carrito.controller.js";

const router = Router()

router.get(
    "/",
    getCar
)

router.post(
    "/addToCar/",
    [
        validarJWT,
        check("user",'Agrega tu ID porfa.').not().isEmpty(),
        validarCampos
    ],
    addToCar
)

router.delete(
    "/deleteCar",
    [
        validarJWT,
        validarCampos
    ],
    deleteCar
)

router.put(
    "/deleteProduct",
    [
        validarJWT,
        validarCampos
    ],
    deleteProduct
)

export default router