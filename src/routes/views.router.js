import express from "express";
import Product from "../models/product.model.js";

const viewsRouter = express.Router();

viewsRouter.get('/', async(req, res) => {
    try {
        const products = await Product.getProducts();
        res.render('home', {products});        
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message})    
    }
});

viewsRouter.get('/realtimeproducts', async(req, res) => {
    try {
        const products = await Product.getProducts();
        res.render('realTimeProducts', {products});        
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message})
    }
});

export default viewsRouter;