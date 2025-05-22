import express from "express";
import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";

const viewsRouter = express.Router();

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

viewsRouter.get('/products', async (req, res) => {
    try {
        const {limit = 8, page = 1, sort, query} = req.query;

        const filter = {};
        if (query){
            if (query === 'available') filter.status = true;
            else filter.category = query;
        }

        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort === 'asc' ? {price : 1} : sort === 'desc' ? {price : -1 } : {},
            lean: true
        };

        const result = await Product.paginate(filter, options);

        // Prepara flags
        const sortAscSelected = sort === 'asc';
        const sortDescSelected = sort === 'desc';

        res.render('products', {
            products: result.docs,
            limit,
            query,
            sort,
            page: result.page,
            totalPages: result.totalPages,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `http://localhost:8080/products?limit=${limit}&page=${result.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: result.hasNextPage ? `http://localhost:8080/products?limit=${limit}&page=${result.nextPage}&sort=${sort}&query=${query}` : null,
            sortAscSelected,
            sortDescSelected
        });

    } catch (error) {
        res.status(500).render('error', { message: "Error al obtener productos" });
    }
});

viewsRouter.get('/products/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await Product.findById(pid).lean();
        if (!product) {
            return res.status(404).render('error', { message: 'Producto no encontrado' });
        }
        res.render('productDetail', { product });
    } catch (error) {
        res.status(500).render('error', { message: 'Error al obtener el producto' });
    }
});

viewsRouter.get('/carts/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await Cart.findById(cid).populate('products.product').lean();
        if (!cart) return res.status(404).render('error', { message: 'Carrito no encontrado' });

        res.render('cartDetail', { cart });
    } catch (error) {
        res.status(500).render('error', { message: error.message });
    }
});

export default viewsRouter;
