import Product from "../models/product.model.js";

const getAllProducts = async(req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ status: "success", payload: products });
    } catch (error) {
        res.status(500).json({ })
    }
}

const createProduct = async(req, res) => {
    try {
        const {title, description, code, price, stock, category, thumbnail} = req.body;

        const product = new Product({title, description, code, price, stock, category, thumbnail});
        await product.save();
        res.status(201).json({ status: "success", payload: product });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al crear el producto" });
    }
}

const updateProduct = async(req, res) => {
    try {
        const pid = req.params.pid;
        const updateData = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(pid, updateData, { new: true });

        if(!updateData) return res.status(404).json({ status: "error", message: "Producto no encontrado" });
        res.status(200).json({ status: "success", payload: updatedProduct });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al actualizar el producto" });
    }
}

const deleteProduct = async(req, res) => {
    try {
        const pid = req.params.pid;

        const deletedProduct = await Product.findByIdAndDelete(pid);
        if(!deletedProduct) return res.status(404).json({ status: "error", message: "Producto no encontrado" });
        res.status(200).json({ status: "success", payload: deletedProduct });
    } catch (error) {
        res.status(200).json({ status: "error", message: "Error al eliminar el producto" });
    }
}

const pagesProducts = async(req, res) => {

    try {
        const {limit = 10, page = 1, sort, query} = req.query;

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

        res.json({
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `http://localhost:8080/products?limit=${limit}&page=${result.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: result.hasNextPage ? `http://localhost:8080/products?limit=${limit}&page=${result.nextPage}&sort=${sort}&query=${query}` : null
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al obtener los productos" });
    }
}

export{ getAllProducts, createProduct, updateProduct, deleteProduct, pagesProducts };