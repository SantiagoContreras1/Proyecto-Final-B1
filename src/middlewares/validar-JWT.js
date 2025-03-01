import jwt from "jsonwebtoken"
import User from "../users/user.model.js"

export const validarJWT = async (req,res,next) => {
    const token = req.header('x-token')

    if (!token) {
        return res.status(401).json({
            mensaje: 'No hay token en la petición'
        })
    }

    try {

        const {uid} = jwt.verify(token,process.env.SECRETPRIVATYKEY)
        const user = await User.findById(uid)

        if (!user) {
            return res.status(401).json({
                msg: "user no existe en DB"
            })
        }

        if (!user.estado) {
            return res.status(401).json({
                msg: "user no esta activo"
            })
        }

        req.user = user
        next()
        
        
    } catch (error) {
        res.status(401).json({
            mensaje: 'Token no válido',
            error: error.message
        })
    }
}