import jwt from "jsonwebtoken"

export const generarJWT = (uid='')=>{

    return new Promise((resolve,reject)=>{
        const payload = {uid} // Se carga la data del usuario que posee este ID

        //GENERAR TOKEN
        jwt.sign(
            payload, // Enviar la data
            process.env.SECRETPRIVATYKEY, // Envia mi firma, la que esta en el .env
            {
                expiresIn: '5h'
            },
            (err,token)=>{ // Callback
                err ? (console.log(err),reject('No se generó el token correctamente')) : resolve(token) 
            }
        )


    })
}