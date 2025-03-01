import { hash,verify } from "argon2";
import User from "../users/user.model.js"
import { generarJWT } from "../helpers/generar-JWT.js";

export const register = async (req,res) => {
    try {
        const data = req.body
        const encryptedPassword = await hash(data.password)

        const user = await User.create({
            username: data.username,
            email: data.email,
            password: encryptedPassword,
            role: data.role
        })

        res.status(200).json({
            message: "Usuario creado, mirá.....",
            user
        })
    } catch (error) {
        res.status(500).json({
            message: "Error al registrar usuario",
            error: error.message
        })
    }
}

export const login = async (req,res) => {
    const {email,password} = req.body

    try {
        const user = await User.findOne({email})

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            })
        }

        if (!user.estado) {
            return res.status(400).json({
                message: "Usuario inactivo"
            })
        }

        const verifyPassword = await verify(user.password,password)
        if (!verifyPassword) {
            return res.status(400).json({
                message: "Credenciales incorrectas"
            })
        }

        const token = await generarJWT(user.id)
        res.status(200).json({
            message: "Usuario autenticado",
            userDetails:{
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                token
            }
        })
    } catch (error) {
        res.status(500).json({
            message: "Error al iniciar sesión",
            error: error.message
        })
    }
}