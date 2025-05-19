import express from 'express';
import uploader from '../utils/uploader.js';
import { getAllProducts, createProduct, updateProduct, deleteProduct} from "../controllers/products.controller.js";
import Product from '../models/product.model.js';

const productsRouter = express.Router();

productsRouter.get('/', getAllProducts);
productsRouter.post('/', createProduct);
productsRouter.put('/:pid', updateProduct);
productsRouter.delete('/:pid', deleteProduct);

productsRouter.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ status : "success", payload: products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

productsRouter.post('/', uploader.single('file'), async (req, res) => {

    if (!req.file) return res.status(401).json({ message: "No se ha subido ninguna imagen" });    

    const title = req.body.title;
    const price = parseInt(req.body.price);
    const thumbnail = '/img/' + req.file.filename;

    await Product.addProduct({ title, price, thumbnail });
    res.redirect('/realTimeProducts');
})


productsRouter.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await Product.findById(pid);

        if (product) {
            res.status(200).json({ status: "success", payload: product });
        } else {
            res.status(404).json({ message: "Producto no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el producto" });
    }
});



productsRouter.post('/', async (req, res) => {
    try {
        const newProduct = req.body;

        const product = new Product(newProduct);
        await product.save();
        res.status(201).json({ status: "success", payload: product });
    } catch (error) {
        res.status(500).json({ error: "Error al crear el producto" });
    }
});

productsRouter.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const updatedFields = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(pid, updatedFields, { new: true });

        if (updatedProduct) {
            res.status(200).json({ updatedProduct, message: "Producto actualizado" });
        } else {
            res.status(404).json({ message: "Producto no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el producto" });
    }
});

productsRouter.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const deleted = await Product.findByIdAndDelete(pid);

        if (deleted) {
            res.status(200).json({ message: "Producto eliminado correctamente" });
        } else {
            res.status(404).json({ message: "Producto no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el producto" });
    }
});

export default productsRouter;
