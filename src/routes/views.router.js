import express from "express";
import ProductManager from "../managers/ProductManager.js";

const viewsRouter = express.Router();

const productManager = new ProductManager();
const user = {username: "Pepe", isAdmin: true};

const middlewareIsAdmin = (req, res, next) => {
    if(user.isAdmin){
        next();
    }else{
        res.redirect('/error');
    }
}

viewsRouter.get('/', middlewareIsAdmin, (req, res) => {
    res.render('home');
})

viewsRouter.get('/realtimeproducts', async(req, res) => {

    const products = await productManager.getProducts();

    res.render('realtimeproducts', {products, user});
})

export default viewsRouter;