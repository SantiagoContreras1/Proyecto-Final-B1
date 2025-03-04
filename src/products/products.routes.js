import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-JWT.js";

import { saveProduct,getProducts,searchProduct,updateProduct,deleteProduct } from "./products.controller.js";

const router = Router()

router.get("/",getProducts)

router.get(
    "/search/:id",
    [
        validarJWT
    ],
    searchProduct
)

router.post(
    "/save/",
    [
        validarJWT,
        check("name", "El nombre es obligatorio").not().isEmpty(),
        check("price", "El precio es obligatorio").not().isEmpty(),
        check("description", "La descripción es obligatorio").not().isEmpty(),
        validarCampos
    ],
    saveProduct
)

router.put(
    "/update/:id",
    [
        validarJWT,
        check('id','ID no válido').isMongoId(),
        validarCampos
    ],
    updateProduct
)

router.delete(
    "/delete/:id",
    [
        validarJWT,
        check('id','ID no válido').isMongoId(),
        validarCampos
    ],
    deleteProduct
)


export default router