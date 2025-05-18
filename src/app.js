import express from "express";
import { engine } from "express-handlebars";
import viewsRouter from "./routes/views.router.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import http from "http";
import { Server } from "socket.io";
import ProductManager from "./managers/ProductManager.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server);


app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded( { extended: true } ));

const PORT = 8080;
//handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

//endpoints
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);



//websocket servidor
const productManager = new ProductManager();
io.on('connection', (socket) => {
    console.log("Nuevo cliente conectado");

    socket.on("newProduct", async(productData)=>{
        try {
            const newProduct =await productManager.addProduct(productData);
            
            io.emit("productAdded", newProduct);
        } catch (error) {
            console.error("Error al añadir el producto")
        }
    });

    socket.on("deleteProduct", async (productId) => {
    try {
        await productManager.deleteProductById(productId);
        io.emit("productDeleted", productId);
    } catch (error) {
        console.error("Error al eliminar el producto:", error.message);
    }
});
});


server.listen(PORT, () => {
    console.log("Servidor iniciado en el puerto ", PORT);
});
