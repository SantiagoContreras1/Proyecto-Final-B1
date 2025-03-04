import Product from "../products/product.model.js"
import Category from "./category.model.js"

export const saveCategory = async (req,res) => {
    try {
        const {name,description} = req.body
        const category = new Category({name,description})

        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({
                ss:false,
                message: "Vos sos un user, no podes publicar categorias nuevas."
            })
        }

        await category.save()

        res.status(200).json({
            message:"Category saved successfully",
            category
        })

    } catch (error) {
        res.status(500).json({
            message: "Error saving category boludin",
            error: error.message
        })
    }


}

export const getCategories = async (req,res) => {
    try {
        const query = {estado:true}

        const categories = await Category.find(query)
            .populate({
                path: 'products', // Esto trae todos los productos asociados
                select: 'name description price stock ventas estado' // Selecciona los campos que va a traer
            });

        res.status(200).json({
            categories
        })

    } catch (error) {
        res.status(500).json({
            message: "Error getting categories boludin",
            error: error.message
        })
    }
}

export const updateCategory = async (req,res) => {
    try {
        const {id} = req.params
        const {...data} = req.body

        const category = await Category.findById(id)
        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            })
        }

        //Ver que el editor sea un admin
        if(req.user.role !== 'admin'){
            return res.status(403).json({
                ss:false,
                message: "No tienes permisos para editar categorias, payaso."
            })
        }

        const updatedCategory = await Category.findByIdAndUpdate(id,data,{new:true})

        res.status(200).json({
            message: "Category updated successfully",
            updatedCategory
        })
    } catch (error) {
        res.status(500).json({
            message: "Error updating category boludin",
            error: error.message
        })
    }
}

export const deleteCategory = async (req,res) => {
    try {
        const {id} = req.params
        const {confirm} = req.body
        const category = await Category.findById(id)

        if (!category) {
            return res.status(404).json({
                ss:false,
                message: "Category not found"
            })
        }

        if(req.user.role !== 'admin'){
            return res.status(403).json({
                ss:false,
                message: "No tienes permisos para eliminar categorias, payaso."
            })
        }

        // Pedir la confirmacion
        if (!confirm) {
            return res.status(400).json({
                message: `Admin, ¿En serio queres borrar la categoria? Envía un valor 'true' para confirmar`
            })
        }

        // Buscar la categoria por defecto
        const defaultCategory = await Category.findOne({name:'Productos Sin Categoria'})
        if (!defaultCategory) {
            return res.status(404).json({
                message: "No hay categoria por defecto para asignarle los pobrecitos productos"
            })
        }

        // Buscar los productos de la categoría eliminada
        const productosHuerfanos = await Product.find({category: id})

        // Mover a los productos huérfanos
        await Product.updateMany({ category:id }, {category: defaultCategory._id})

        //Agregar los productos al array de la categoria por defecto
        defaultCategory.products.push(...productosHuerfanos.map(product => product._id))
        defaultCategory.markModified('products');
        await defaultCategory.save()

        const deletedCategory = await Category.findByIdAndUpdate(id,{estado:false},{new:true})

        res.status(200).json({
            message: "Category deleted successfully",
            deletedCategory
        })

    } catch (error) {
        res.status(500).json({
            message: "Error deleting category boludin",
            error: error.message
        })
    }
}