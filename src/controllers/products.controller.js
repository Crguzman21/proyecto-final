import Product from "../models/product.model.js";

const getAllProducts = async(req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ status: "success", payload: products });
    } catch (error) {
        res.status(500).json({ })
    }
}

const createProduct = async(req, res) => {
    try {
        const {title, description, code, price, stock, category, thumbnail} = req.body;

        const product = new Product({title, description, code, price, stock, category, thumbnail});
        await product.save();
        res.status(201).json({ status: "success", payload: product });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al crear el producto" });
    }
}

const updateProduct = async(req, res) => {
    try {
        const pid = req.params.pid;
        const updateData = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(pid, updateData, { new: true });

        if(!updateData) return res.status(404).json({ status: "error", message: "Producto no encontrado" });
        res.status(200).json({ status: "success", payload: updatedProduct });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al actualizar el producto" });
    }
}

const deleteProduct = async(req, res) => {
    try {
        const pid = req.params.pid;

        const deletedProduct = await Product.findByIdAndDelete(pid);
        if(!deletedProduct) return res.status(404).json({ status: "error", message: "Producto no encontrado" });
        res.status(200).json({ status: "success", payload: deletedProduct });
    } catch (error) {
        res.status(200).json({ status: "error", message: "Error al eliminar el producto" });
    }
}

export{ getAllProducts, createProduct, updateProduct, deleteProduct };