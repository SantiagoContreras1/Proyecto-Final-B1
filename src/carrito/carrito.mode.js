import {Schema,model} from "mongoose"

const CarritoSchema = Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products:[{
        product: {type: Schema.Types.ObjectId, ref: 'Product', required: true},
        cantidad:{type: Number,required:true}
    }]
},
    { toJSON: { virtuals: true } }
)

// Esto hace que cada vez que recuperes un carrito, total se calcule automáticamente sin 
// necesidad de almacenarlo en la base de datos.
CarritoSchema.virtual('total').get(function () {
    return this.products.reduce((acc, item) => acc + (item.product.price * item.cantidad), 0);
});

CarritoSchema.methods.toJSON = function() {
    const {__v,password,_id,...carrito} = this.toObject()
    carrito.uid = _id
    return carrito
}

export default model('Carrito',CarritoSchema)