import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const cartsRouter = Router();
const cartManager = new CartManager('./src/data/carts.json');

cartsRouter.post('/', async (req, res) => {
    try {
        const cart = await cartManager.addCart();
        res.status(201).json({ cart, message: "Carrito creado con éxito" });
    } catch (error) {
        res.status(500).json({ error: "Error al crear el carrito" });
    }
});

cartsRouter.get('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const products = await cartManager.getProductsInCartById(cid);
        res.status(200).json({ products, message: "Productos obtenidos con éxito" });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos del carrito" });
    }
});

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = parseInt(req.params.pid);
        const quantity = req.body.quantity || 1;

        const cart = await cartManager.addProductInCart(cid, pid, quantity);
        res.status(200).json({ cart, message: "Producto agregado con éxito" });
    } catch (error) {
        res.status(500).json({ error: "Error al agregar el producto al carrito" });
    }
});

export default cartsRouter;
