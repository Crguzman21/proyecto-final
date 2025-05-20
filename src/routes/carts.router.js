import express from 'express';
import { createCart, getCartProducts, addProductToCart, deleteProductById, replaceProducts, updateQuantity, deleteProductByCart } from "../controllers/carts.controller.js";

const cartsRouter = express.Router();

cartsRouter.post('/', createCart);
cartsRouter.get('/:cid', getCartProducts);
cartsRouter.post('/:cid/product/:pid', addProductToCart);
cartsRouter.delete('/:cid/product/:pid', deleteProductById);
cartsRouter.put('/:cid', replaceProducts);
cartsRouter.put('/:cid/product/:pid', updateQuantity);
cartsRouter.delete('/:cid', deleteProductByCart);

export default cartsRouter;
