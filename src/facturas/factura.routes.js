import { Router } from "express";

import { validarJWT } from "../middlewares/validar-jwt.js";

import {compraFinal,historialFacturas,editarFactura} from "./factura.controller.js"

const router = Router()

router.get(
    "/historial/:id",
    [
        validarJWT
    ],
    historialFacturas
)

router.post(
    "/comprar",
    [
        validarJWT
    ],
    compraFinal
)

router.put(
    "/editar/:id",
    [
        validarJWT
    ],
    editarFactura
)

export default router