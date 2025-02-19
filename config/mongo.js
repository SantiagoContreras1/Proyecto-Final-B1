import mongoose from "mongoose";
export const dbConnection = async () => {
    try {
           //Metodos de escucha
           mongoose.connection.on('error',()=>{
            //Siempre se ejecuta el callback
            console.log('MongoDB | No se pudo conectar a MongoDB')
            mongoose.disconnect()
        })

        mongoose.connection.on('connecting',()=>{
            console.log('MongoDB | Conectando')
        })

        mongoose.connection.on('connected',()=>{
            console.log('MongoDB | Conectado a MongoDB')
        })

        //Cuando abre la DB
        mongoose.connection.on('open',()=>{
            console.log('MongoDB | Conexion exitosa')
        })

        //Reconectando, por si se cayo la conexion en algun momento
        mongoose.connection.on('reconnected',()=>{
            console.log('MongoDB | Reconectando a MongoDB')
        })

        //Desconexxion
        mongoose.connection.on('disconnected',()=>{
            console.log('MongoDB | Disconnected')
        })


        //Funcion de mongoose para conectar
        await mongoose.connect(process.env.URI_MONGO, { //Devuelve una promesa
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 50, //Maximo de conexiones que se pueden tener
        })
    } catch (error) {
        console.log('Database connection failed!!',error)
    }
}