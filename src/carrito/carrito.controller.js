import Carrito from "./carrito.model.js";
import User from "../users/user.model.js";
import Product from "../products/product.model.js";

export const addToCar = async (req,res) => {
    try {
        const {user,productID,cantidad} = req.body // ID Del producto y la cantidad

        const product = await Product.findById(productID)
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            })
        }

        //Buscar si el user ya tiene un carrito
        let car = await Carrito.findOne({user})


        if (!car) {
            //Si le user no tiene carrito, se le crea un carrito
            car = await Carrito.create({
                user,
                products: [{ product: product._id, cantidad }]
            })
        }else{
            // Si ya tiene carrito, ver si el producto ya esta en el carrito
            const existingProduct = car.products.find(p => p.product.toString() === productID)

            //Si el producto ya esta, solo se suma la cantidad
            if (existingProduct) {
                existingProduct.cantidad += cantidad
            }else{
                //Si no esta, se agrega al array de productos
                car.products.push({
                    product: product._id,
                    cantidad
                })
            }

            await car.save()
        }

        // **Populate user y productos**
        car = await Carrito.findOne({ user })
        .populate("user", "name email")
        .populate("products.product")

        // Convertir a objeto plano de js para que incluya los campos virtuales
        const carObject = car.toObject({ virtuals: true });

        res.status(200).json({
            message: "Producto agregado al carrito.",
            car: carObject
        })
    } catch (error) {
        res.status(500).json({
            message: "Error al agregar al carrito brrrrrrro.",
            error: error.message
        })
    }
}

export const getCar = async (req,res) => {
    const userId = req.header("user")
    try {
        const carrito = await Carrito.findOne({ user: userId, estado: true })
            .populate("user",'name email')
            .populate('products.product')

        if (!carrito) {
            return res.status(404).json({
                message: "No tenes carrito en curso broski"
            })
        }

        // Convertir a objeto plano de js para que incluya los campos virtuales
        const carritoObject = carrito.toObject({ virtuals: true });


        res.status(200).json({
            message: "Ese es tu carrito mirá..........",
            carritoObject
        })
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener el carrito.",
            error: error.message
        })
    }
}

export const deleteCar =async (req,res) => {
    const userId = req.header("user") // ID Del user
    try {
        const carrito = await Carrito.findOne({ user: userId, estado: true })

        if (!carrito) {
            return res.status(404).json({
                message: "No tenes carrito en curso broski"
            })
        }

        carrito.estado = false
        await carrito.save()

        res.status(200).json({
            message: "Carrito eliminado correctamente"
        })
        
    } catch (error) {
        res.status(500).json({
            message: "Error al cancelar todo el carrito.",
            error: error.message
        })
    }
}

export const deleteProduct = async (req,res) => {
    const userId = req.header("user") // ID Del user
    try {
        const carrito = await Carrito.findOne({ user: userId, estado: true })
        const {productID,cantidad} = req.body // ID del producto a eliminar

        if (!carrito) {
            return res.status(404).json({
                message: "No tenes carrito en curso broski"
            })
        }

        // Buscar el producto en el carrito
        const productIndex = carrito.products.findIndex(p => p.product.toString() === productID.toString())

        if (productIndex === -1) {
            return res.status(404).json({
                message: "No encontramos el producto en tu carrito"
            })
        }

        if (cantidad === 0) {
            // Si la cantidad es 0, entonces se quita el product del carrito pq no lo quiere
            carrito.products.splice(productIndex, 1)
        }else{
            // Si hay una nueva cantidad, se debe de actualizar
            carrito.products[productIndex].cantidad = cantidad
        }

        await carrito.save()

        // **Populate user y productos**
        let car = await Carrito.findOne({ user: userId })
        .populate("user", "name email")
        .populate("products.product")

        // Convertir a objeto plano de js para que incluya los campos virtuales
        const carObject = car.toObject({ virtuals: true });

        return res.status(200).json({
            msg: cantidad === 0 ? "Producto eliminado del carrito" : "Cantidad actualizada en el carrito",
            //carrito: carrito.toObject({ virtuals: true }) // Asegurar que incluya el total actualizado
            carrito: carObject
        })

    } catch (error) {
        res.status(500).json({
            message: "Error al eliminar el producto del carrito",
            error: error.message
        })
    }
}