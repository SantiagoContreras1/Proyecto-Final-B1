import { Schema,model } from "mongoose";

const FacturaSchema = Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productos:[{
        // Se hace referencia al carrito, pero si el carrito se borra, igual se quedan los datos
        // en una factura guardada
        product:{type: Schema.Types.ObjectId, ref: 'Product', required: true },
        nombre: { type: String, required: true },
        precio: { type: Number, required: true },
        cantidad: { type: Number, required: true },

    }],
    carrito:{
        type: Schema.Types.ObjectId,
        ref: 'Carrito',
        required: true
    },
    total:{
        type: Number,
        required: true
    },
    estado:{
        type: Boolean,
        default: true
    }
},
{
    timestamps: true,
    versionKey: false
}
)

FacturaSchema.methods.toJSON= function(){
    const {__v,_id,...factura} = this.toObject()
    factura.uid = _id
    return factura
}

export default model('Factura',FacturaSchema)