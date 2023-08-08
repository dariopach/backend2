import express from "express";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid"; // Para generar IDs únicos
import { ProductManager } from "./ProductManager.js";

const app = express();
const PORT = 8080;

const manager = new ProductManager("src/productos.json");

// Middleware para parsear JSON en el cuerpo de las peticiones
app.use(express.json());

// Rutas para productos
const productsRouter = express.Router();

productsRouter.get("/", (req, res) => {
    const limit = parseInt(req.query.limit);
    const products = manager.getProducts();

    if (isNaN(limit)) {
        res.json(products);
    } else {
        res.json(products.slice(0, limit));
    }
});

productsRouter.get("/:pid", (req, res) => {
    const productId = parseInt(req.params.pid);
    const product = manager.getProductById(productId);

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: "Product not found" });
    }
});

productsRouter.post("/", (req, res) => {
    const newProduct = req.body;
    const addedProduct = manager.addProduct(newProduct);
    res.status(201).json(addedProduct);
});

productsRouter.put("/:pid", (req, res) => {
    const productId = parseInt(req.params.pid);
    const updatedProduct = req.body;
    const result = manager.updateProduct(productId, updatedProduct);
    
    if (result) {
        res.json(result);
    } else {
        res.status(404).json({ error: "Product not found" });
    }
});

productsRouter.delete("/:pid", (req, res) => {
    const productId = parseInt(req.params.pid);
    const result = manager.deleteProduct(productId);
    
    if (result) {
        res.json({ message: "Product deleted successfully" });
    } else {
        res.status(404).json({ error: "Product not found" });
    }
});

app.use("/api/products", productsRouter);

// Rutas para carritos
const cartsRouter = express.Router();

cartsRouter.post("/", async (req, res) => {
    const newCart = { id: uuidv4(), products: [] };
    try {
        const cartsData = await fs.readFile("src/carrito.json", "utf8");
        const carts = JSON.parse(cartsData);
        carts.push(newCart);
        await fs.writeFile("src/carrito.json", JSON.stringify(carts, null, 2));
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

cartsRouter.get("/:cid", async (req, res) => {
    const cartId = req.params.cid;
    try {
        const cartsData = await fs.readFile("src/carrito.json", "utf8");
        const carts = JSON.parse(cartsData);
        const cart = carts.find(c => c.id === cartId);
        if (cart) {
            res.json(cart.products);
        } else {
            res.status(404).json({ error: "Cart not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = parseInt(req.params.pid);
    const quantity = req.body.quantity || 1;
    try {
        const cartsData = await fs.readFile("src/carrito.json", "utf8");
        const carts = JSON.parse(cartsData);
        const cart = carts.find(c => c.id === cartId);
        if (!cart) {
            res.status(404).json({ error: "Cart not found" });
            return;
        }

        const productsData = await fs.readFile("src/productos.json", "utf8");
        const products = JSON.parse(productsData);
        const product = products.find(prod => prod.id === productId);
        if (!product) {
            res.status(404).json({ error: "Product not found" });
            return;
        }

        const existingProduct = cart.products.find(p => p.product === productId);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        await fs.writeFile("src/carrito.json", JSON.stringify(carts, null, 2));
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

app.use("/api/carts", cartsRouter);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}).on("error", (error) => {
    console.error("Server error", error);
});