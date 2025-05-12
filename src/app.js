import express from "express";
import CartManager from "./managers/CartManager.js";
import ProductManager from "./managers/ProductManager.js";

const app = express();
app.use(express.json());

const cartManager = new CartManager();
const productManager = new ProductManager();

app.get("/", (req, res) => {
    res.send("hola mundo 2.0000");
});

app.get("/api/products", async (req, res) => {
    const products = await productManager.getProducts();
    res.status(200).json(products);
});

// Traer solo el producto con el id proporcionado
app.get("/api/products/:pid", async (req, res) => {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);

    if (product) {
    res.status(200).json(product);
    } else {
    res.status(404).json({ message: "Producto no encontrado" });
    }
});

// Agregar un nuevo producto
app.post("/api/products", async (req, res) => {
    const data = req.body;

  // Validación básica
    const requiredFields = [
    "title",
    "description",
    "code",
    "price",
    "stock",
    "category",
    ];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
        return res
            .status(400)
            .json({ message: `Faltan los campos: ${missingFields.join(", ")}` });
    }

    const newProduct = await productManager.addProduct(data);
        res
    .status(201)
    .json({ newProduct, message: "Producto creado correctamente" });
});

// Actualizar un producto
app.put("/api/products/:pid", async (req, res) => {
    const { pid } = req.params;
    const updatedFields = req.body;

    const updatedProduct = await productManager.updateProductById(
        pid,
        updatedFields
    );

    if (updatedProduct) {
        res.status(200).json({ updatedProduct, message: "Producto actualizado" });
    } else {
        res.status(404).json({ message: "Producto no encontrado" });
    }
});

// Eliminar un producto
app.delete("/api/products/:pid", async (req, res) => {
    const { pid } = req.params;
    const deleted = await productManager.deleteProductById(pid);

    if (deleted) {
        res.status(200).json({ message: "Producto eliminado correctamente" });
    } else {
        res.status(404).json({ message: "Producto no encontrado" });
    }
});

app.post("/api/carts", async (req, res) => {
    const carts = await cartManager.addCart();
    res.status(201).json({ carts, message: "Carrito creado con exito" });
});

app.get("/api/carts/:cid", async (req, res) => {
    const cid = req.params.cid;
    const products = await cartManager.getProductsInCartById(cid);
    res.status(200).json({ products, message: "Productos obtenidos con exito" });
});

app.post("/api/carts/:cid/product/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = parseInt(req.params.pid);
    const quantity = req.body.quantity;

    const carts = await cartManager.addProductInCart(cid, pid, quantity);
    res.status(200).json({ carts, message: "Producto agregado con exito" });
});

app.listen(8080, () => {
    console.log("Servidor iniciado en el puerto 8080");
});
