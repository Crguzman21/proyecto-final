import express from 'express';
import { getAllProducts, createProduct, updateProduct, deleteProduct, pagesProducts} from "../controllers/products.controller.js";

const productsRouter = express.Router();

productsRouter.get('/', getAllProducts);
productsRouter.post('/', createProduct);
productsRouter.put('/:pid', updateProduct);
productsRouter.delete('/:pid', deleteProduct);
productsRouter.get('/products', pagesProducts);



export default productsRouter;
