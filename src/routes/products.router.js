import express from 'express';
import ProductManager from '../managers/ProductManager.js';
import uploader from '../utils/uploader.js';

const productsRouter = express.Router();
const productManager = new ProductManager('');

productsRouter.post('/', uploader.single('file'), async (req, res) => {

    if (!req.file) return res.status(401).json({ message: "No se ha subido ninguna imagen" });    

    const title = req.body.title;
    const price = parseInt(req.body.price);
    const thumbnail = '/img/' + req.file.filename;

    await productManager.addProduct({ title, price, thumbnail });
    res.redirect('/realTimeProducts');
})

productsRouter.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos" });
    }
});

productsRouter.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productManager.getProductById(pid);

        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ message: "Producto no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el producto" });
    }
});



productsRouter.post('/', async (req, res) => {
    try {
        const data = req.body;

        const requiredFields = [
            "title", "description", "code", "price", "stock", "category"
        ];
        const missingFields = requiredFields.filter((field) => !data[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Faltan los campos: ${missingFields.join(", ")}`
            });
        }

        const newProduct = await productManager.addProduct(data);
        res.status(201).json({ newProduct, message: "Producto creado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al crear el producto" });
    }
});

productsRouter.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const updatedFields = req.body;

        const updatedProduct = await productManager.updateProductById(pid, updatedFields);

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
        const deleted = await productManager.deleteProductById(pid);

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
