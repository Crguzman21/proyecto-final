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

const deleteProductById = async (req, res) => {
    try {
        const {cid, pid} = req.params;
        const cart = await Cart.findById(cid);

        if(!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
        cart.products = cart.products.filter((product) => product.product.toString() !== pid);
        await cart.save();
        res.status(200).json({ status: "success", payload: cart });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al eliminar el producto del carrito" });
    }
};

const replaceProducts = async (req, res) => {

    const { cid } = req.params;
    const { products } = req.body;

    try {
        const cart = await Cart.findByIdAndDelete(cid);
        if(!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
        cart.products = products;
        await cart.save();
        res.status(200).json({ status: "success", payload: cart });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al reemplazar los productos del carrito" });
    }
};

const updateQuantity = async (req, res) => {

    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await Cart.findById(cid);
        if(!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

        const prod = cart.products.find((product) => product.product.toString() === pid);
        if(prod){
            prod.quantity = quantity;
        }else{
            cart.products.push({product: pid, quantity});
        }

        await cart.save();
        res.status(200).json({ status: "success", payload: cart });
    } catch (error) {
        res.json({ status: "error", message: "Error al actualizar la cantidad del producto en el carrito" });
    }
};

const deleteProductByCart = async (req, res) => {
    const { cid, pid} = req.params;
    try {
        const cart = await Cart.findByIdAndDelete(cid);
        if(!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

        cart.products = [];
        await cart.save();
        res.status(200).json({ status: "success", payload: cart });
    } catch (error) {
        res.json({ status: "error", message: "Error al eliminar el producto del carrito" });
    }
};


export { createCart, getCartProducts, addProductToCart, deleteProductById, replaceProducts, updateQuantity, deleteProductByCart };