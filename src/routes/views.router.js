import express from "express";
import ProductManager from "../managers/ProductManager.js";
import Product from "../models/product.model.js";

const viewsRouter = express.Router();
const productManager = new ProductManager();

viewsRouter.get('/', async(req, res) => {
    try {
        const products = await Product.find().lean();
        res.render('home', {products});        
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message})
    }
});

viewsRouter.get('/realtimeproducts', async(req, res) => {
    try {
        const products = await Product.find().lean();
        res.render('realTimeProducts', {products});        
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message})
    }
});

export default viewsRouter;