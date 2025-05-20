import Cart from "../models/cart.model.js";

const createCart = async (req, res) => {
    try {
        const cart = new Cart();
        await cart.save();
        res.status(201).json({ status: "success", payload: cart });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al crear el carrito" });
    }
}

const getCartProducts = async (req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await Cart.findOne({ _id: cid }).populate("products.product");

        if(!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
        res.status(200).json({ status: "success", payload: cart.products });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al obtener el carrito" });
    }
};

const addProductToCart = async (req, res) => {
    try {
        const {cid, pid} = req.params;
        const { quantity} = req.body;
        const updateCart = await Cart.findOneAndUpdate({ _id: cid }, { $push: {products: {product: pid, quantity}}}, { new: true, runValidators: true });
        
        if(!updateCart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });


        res.status(200).json({ status: "success", payload: updateCart });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al agregar el producto al carrito" });
    }
};

export { createCart, getCartProducts, addProductToCart };