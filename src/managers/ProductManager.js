import fs from 'fs';

class ProductManager{
    constructor() {
        this.path = './src/data/products.json';
    }

    generateNewId = (products) => {
        if(products.length > 0){
            return products[products.length - 1].id + 1;
        }else{
            return 1;
        }
    }

    getProducts = async () => {
        const productsJson = await fs.promises.readFile(this.path, 'utf-8');
        const products = JSON.parse(productsJson);
        return products;
    }

    getProductById = async (pid) => {
        const productsJson = await fs.promises.readFile(this.path, 'utf-8');
        const products = JSON.parse(productsJson);
        return products.find((products) => products.id == pid);
    }

    addProduct = async (newProduct) => {
        const products = await this.getProducts();
        const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;
        const productToAdd = {
            id: newId,
            title: newProduct.title,
            description: newProduct.description,
            code: newProduct.code,
            price: newProduct.price,
            status: newProduct.status != undefined ? newProduct.status : true,
            stock: newProduct.stock,
            category: newProduct.category,
            thumbnail: newProduct.thumbnail || [],
        }
        products.push(productToAdd);
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8');
        return productToAdd;
    }

    updateProductById = async (pid, updatedFields) => {
        const products = await this.getProducts();
        const productIndex = products.findIndex((p) => p.id === pid);
        if (productIndex !== -1) {
            if (updatedFields.id) {
                delete updatedFields.id;
            }
            products[productIndex] = { ...products[productIndex], ...updatedFields };
            await fs.promises.writeFile(
                this.path,
                JSON.stringify(products, null, 2),
                "utf-8"
            );
            return products[productIndex];
        }
        return null;
    }

    deleteProductById = async (pid) => {
        const products = await this.getProducts();
        const newProducts = products.filter((p) => p.id !== pid);
        await fs.promises.writeFile(
            this.path,
            JSON.stringify(newProducts, null, 2),
            "utf-8"
        );
        return newProducts;
    };
}

export default ProductManager;
