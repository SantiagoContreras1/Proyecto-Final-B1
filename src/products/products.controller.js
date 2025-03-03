import Product from "./product.model.js";
import Category from "../categories/category.model.js";

export const saveProduct = async (req,res) => {
    try {
        const data = req.body
        const category = await Category.findById(data.category)

        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({
                ss:false,
                message: "Vos sos un user, no podes publicar categorias nuevas."
            })
        }

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            })
        }

        const product = await Product.create({
            name: data.name,
            description: data.description,
            price: data.price,
            stock: data.stock,
            category: category._id,
            ventas: data.ventas
        })

        // Push al array de productos de la categoria
        category.products.push(product._id)
        await category.save()

        await product.save()

        res.status(200).json({
            ss:true,
            msg: 'Ahí esta tu producto mirá....',
            product: product
        })

    } catch (error) {
        res.status(500).json({
            message: "Error saving product",
            error: error.message
        })
    }
}

export const getProducts = async (req,res) => {
    const {bestSeller} = req.query
    try {
        const query = { estado: true }

        if (bestSeller) {
            query.ventas = { $gte: Number(bestSeller) } // Filtrar por ventas mayores o iguales
        }

        const [total, products] = await Promise.all([
            Product.countDocuments(query),
            Product.find(query).sort({ ventas: bestSeller ? 1 : -1 }) // Si hay filtro, ordena de mayor a menor
        ]);

        res.status(200).json({
            ss:true,
            total,
            products
        })
    } catch (error) {
        res.status(500).json({
            message: "Error getting products",
            error: error.message
        })
    }
}

export const searchProduct = async (req,res) => {
    try {
        const {id} = req.params
        const product = await Product.findById(id)

        if (!product) {
            return res.status(404).json({
                ss:false,
                msg: 'No se encontró el producto'
            })
        }

        res.status(200).json({
            ss:true,
            product
        })
        
    } catch (error) {
        res.status(500).json({
            message: "Error searching product",
            error: error.message
        })
    }
}

export const updateProduct = async (req,res) => {
    try {
        const {id} = req.params
        const {...data} = req.body
        const category = await Category.findById(data.category)

        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({
                ss:false,
                message: "Vos sos un user, no podes publicar categorias nuevas."
            })
        }

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            })
        }

        const updatedProducto = await Product.findByIdAndUpdate(id,data,{new:true})

        res.status(200).json({
            ss:true,
            msg:'Actualice el producto oiste.....',
            updatedProducto
        })
        
    } catch (error) {
        res.status(500).json({
            message: "Error updating product",
            error: error.message
        })
    }
}

export const deleteProduct = async (req,res) => {
    try {
        const {id} = req.params
        const {confirm} = req.body
        const product = await Product.findById(id)

        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({
                ss:false,
                message: "Vos sos un user, no podes publicar categorias nuevas."
            })
        }

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            })
        }

        // Pedir la confirmacion
        if (!confirm) {
            return res.status(400).json({
                message: `Admin, ¿En serio queres borrar la categoria? Envía un valor 'true' para confirmar`
            })
        }

        const deletedProduct = await Product.findByIdAndUpdate(id,{estado:false},{new:true})

        res.status(200).json({
            ss:true,
            msg:'Eliminaste el producto oiste.....',
            deletedProduct
        })

    } catch (error) {
        res.status(500).json({
            message: "Error deleting product",
            error: error.message
        })
    }
}