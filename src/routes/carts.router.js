import express from 'express';
import { createCart, getCartProducts, addProductToCart } from "../controllers/carts.controller.js";

const cartsRouter = express.Router();

cartsRouter.post('/', createCart);
cartsRouter.get('/:cid', getCartProducts);
cartsRouter.post('/:cid/product/:pid', addProductToCart);

export default cartsRouter;
