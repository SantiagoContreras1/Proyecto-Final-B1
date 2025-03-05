import Factura from "./factura.model.js";
import Carrito from "../carrito/carrito.model.js";
import Product from "../products/product.model.js"

export const compraFinal = async (req,res) => {
    try {
        const userID = req.user.id

        // 1) Buscar el carrito del user
        const carrito = await Carrito.findOne({user: userID, estado: true})
            .populate('products.product')
            .lean() // lean() convierte el documento en objeto plano e incluye virtuals
        
        // Ver si su carrito no tiene ni v...a
        if (!carrito || carrito.products.length === 0) {
            return res.status(400).json({
                message: "Que queres comprar si no tenes nada en tu carrito pelotudote."
            })
        }
        

        // 2) Calcular el total manualmente
        const total = carrito.products.reduce((acc,item)=> acc + (item.product.price * item.cantidad), 0)
        //console.log('LLEGAMOS AQUI 1')

        // 3) Verificar el stock de los productos con un for
        for (const item of carrito.products) {
            if (item.product.stock < item.cantidad) {
                return res.status(400).json({
                    message: `Hoy si me agarraste en fly, porque no hay suficiente stock para el producto ${item.product.name}.`
                })
            }
        }
        //console.log('LLEGAMOS AQUI 2')

        // 4) Crear la factura con los productos adquiridos
        const factura = await Factura.create({
            user: userID,
            carrito: carrito._id,
            productos: carrito.products.map(item => ({
                product: item.product._id,
                nombre: item.product.name,
                precio: item.product.price,
                cantidad: item.cantidad
            })),
            total
        })
        //console.log('LLEGAMOS AQUI 3')


        // 5) Restar las cantidades compradas del inventario
        for (const item of carrito.products) {
            await Product.findByIdAndUpdate(item.product._id,{
                $inc: { stock: -item.cantidad, ventas: item.cantidad } //Se resta la cantidad comprada del stock
                // inc: operador de actualización en MongoDB que incrementa o decrementa valores 
                // numéricos en un documento sin necesidad de traerlo, modificarlo manualmente y volver a guardarlo
            })
        }

        // 6) Vaciarle el carrito al user
        await Carrito.findByIdAndUpdate(carrito._id, { products: [] });

        res.status(200).json({
            message: "Factura creada con exito, gracias por comprar, pelotudo.",
            factura
        })

    } catch (error) {
        res.status(500).json({
            message: "Error al realizar la compra final",
            error: error.message
        })
    }
}

export const historialFacturas = async (req,res) => {
    try {
        const userID = req.user.id

        const facturas = await Factura.find({user: userID, estado:true})
            .populate('user','name email')
            .populate('productos.product')
        
        res.status(200).json({
            facturas
        })
        
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener el historial de facturas",
            error: error.message
        })
    }
}

export const editarFactura = async (req,res) => {
    try {
        const {id} = req.params // Agarrar el id de la factura en el header
        const {productos} = req.body
        const userRole = req.user.role

        if (userRole !== 'admin') {
            return res.status(403).json({
                message: "No tienes permisos para editar facturas"
            })
        }

        const factura = await Factura.findById(id).populate('productos.product')

        if (!factura) {
            return res.status(404).json({
                message: "Factura no encontrada"
            })
        }

        // 1) Restaurar stock antes de actualizar (devolver lo comprado)
        for (const item of factura.productos) {
            await Factura.findByIdAndUpdate(item.product._id, {
                $inc: { stock: item.cantidad, ventas:-item.cantidad } //Restaurar el stock
            })
        }

        // 2) Verificar si hay suficiente stock para los nuevos productos
        for (const item of productos) {
            const productDB = await Product.findById(item.product);

            if (!productDB) {
                return res.status(404).json({
                    message: `El producto con ID ${item.product} no existe.`
                });
            }

            if (productDB.stock < item.cantidad) {
                return res.status(400).json({
                    message: `No hay suficiente stock para ${productDB.name}.`
                });
            }
        }

        // 3) Restar el stock de los nuevos productos
        for (const item of productos) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.cantidad, ventas: item.cantidad }
            })
        }

        // 4) Calcular el total nuevo
        const totalNew = productos.reduce((acc,item)=> acc+item.precio * item.cantidad, 0)

        // Verifica si totalNew sigue siendo NaN
if (isNaN(totalNew)) {
    return res.status(400).json({
        message: "Error al calcular el total: valores no válidos en los productos",
        productos
    });
}

        // 5) Actualizar la factura en la DB
        const facturaUpdated = await Factura.findByIdAndUpdate(
            id,
            {
                productos: productos.map((item)=>({
                    product: item.product,
                    nombre: item.nombre,
                    price: Number(item.price || item.precio),
                    cantidad: Number(item.cantidad)
                })),
                total: Number(totalNew),
                updatedAt: new Date()
            },
            {new:true}
        ).populate('productos.product')

        res.status(200).json({
            message: "Factura actualizada correctamente",
            facturaUpdated
        })

    } catch (error) {
        res.status(500).json({
            message: "Error al editar la factura",
            error: error.message
        })
    }
}