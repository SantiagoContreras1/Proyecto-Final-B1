import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-JWT.js"

import {saveCategory,getCategories,updateCategory,deleteCategory} from "./category.controller.js"

const router = Router()

router.get("/get/",getCategories)

router.post(
    "/save/",
    [
        validarJWT,
        check("name", "El nombre es obligatorio").not().isEmpty(),
        check("description", "La descripción es obligatorio").not().isEmpty(),
        validarCampos
    ],
    saveCategory
)

router.put(
    "/update/:id",
    [
        validarJWT,
        check("id", "El nombre es obligatorio").isMongoId(),
        validarCampos
    ],
    updateCategory
)

router.delete(
    "/delete/:id",
    [
        validarJWT,
        check("id", "El ID es obligatorio").isMongoId(),
        validarCampos
    ],
    deleteCategory
)

export default router