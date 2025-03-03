import { hash,verify } from "argon2";
import User from "./user.model.js"

export const getUsers = async (req,res) => {
    try {
        const query = {estado:true}
        
        const [total,users] = await Promise.all([
            User.countDocuments(query),
            User.find(query).populate("role")
        ])
        
        res.status(200).json({
            ss: true,
            total,
            users
        })
    } catch (error) {
        res.status(500).json({
            message: "Failed to get users",
            error: error.message
        })
    }
}

export const updateUser = async (req,res) => {
    try {
        const {id} = req.params
        const {password,...data} = req.body

        const user = await User.findById(id)
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        // Ver si tiene permiso de pasarse a admin
        if (req.user.role === 'user' && id !== req.user._id.toString()) {
            return res.status(403).json({
                message: "No tienes permiso para realizar esta acción, payaso."
            })
        }
        
        if (password) {
            data.password = await hash(password)
        }


        const updatedUser = await User.findByIdAndUpdate(id,data,{new:true})

        res.status(200).json({
            ss: true,
            msg: 'Actualizaste tus datos boludin.',
            updatedUser
        })
        
    } catch (error) {
        res.status(500).json({
            message: "Failed to update user",
            error: error.message
        })
    }
}

export const deleteUser = async (req,res) => {
    try {
        const {id} = req.params
        const {confirm} = req.body

        // Verificar si quiere eliminar a otro user y no el suyo. Solo si es admin, si.
        if (req.user.role !== 'admin' && id !== req.user._id.toString()) {
            return res.status(403).json({
                message: "No tienes permiso para realizar esta acción, payaso."
            })
        }

        // Pedir la confirmacion
        if (!confirm) {
            return res.status(400).json({
                message: "Boludito, ¿En serio queres eliminar tu cuenta? Envía un valor 'true' para confirmar"
            })
        }

        const user = await User.findByIdAndUpdate(id,{estado:false},{new:true})

        if (!user) {
            return res.status(404).json({
                ss:false,
                message: "Como queres que borre a un usuario que no existe pelotudo."
            })
        }

        res.status(200).json({
            ss:true,
            message: "Chau user!",
            user
        })
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete user broski",
            error: error.message
        })
    }
}