import {Schema, model} from "mongoose"

const ProductSchema = Schema({
    name: {type: String, required: true},
    description:{
        type: String,
        required: [true,'El nombre del producto, ingresalo porfa']
    },
    price:{
        type: Number,
        required: [true,'El precio del producto, ingresalo porfa']
    },
    stock:{
        type: Number,
        required: [true,'El stock del producto, ingresalo porfa']
    },
    category:{
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: [true,'La categoria del producto, ingresala porfa']
    },
    ventas:{
        type: Number,
        default: 0
    },
    estado:{
        type: Boolean,
        default: true
    }
})

ProductSchema.methods.toJSON = function() {
    const {__v,password,_id,...product} = this.toObject()
    product.uid = _id
    return product
}

export default model('Product',ProductSchema)