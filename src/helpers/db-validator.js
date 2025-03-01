import Role from "../role/role.model.js"
import User from "../users/user.model.js"

export const isValidRole = async (role='') => {
    const existRole = Role.findOne({role})

    if (!existRole) {
        return new Error(`No existe el role: ${role} brrrrrrrrrrrrrrro.`)
    }
}

export const existEmail = async (email='') => {
    const existeEmail = await User.findOne({email})

    if (!existeEmail) {
        return new Error(`Ya hay un pibito con ese email, cambialo.`)
    }
}

export const existentUserById = async (id='') => {
    const userExist = await User.findById(id)

    if (!userExist) {
        throw new Error(`El ID ${id} no existe`)
    }
}