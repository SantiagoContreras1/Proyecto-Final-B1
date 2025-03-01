import mongoose, {Schema,model} from "mongoose"

const CategorySchema = Schema({
    name: {type:String,required:true},
    description: {type:String,required:true},
    products:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    estado:{
        type:Boolean,
        default:true
    }
})

CategorySchema.methods.toJSON = function() {
    const {__v,password,_id,...category} = this.toObject()
    category.uid = _id
    return category
}

export default model('Category',CategorySchema)