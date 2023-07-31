import { ProductManager } from "./ProductManager.js";
import express from "express";

const app = express()

const manager = new ProductManager("./products.json")

app.get('/products', (req, res) => {
    const limit = parseInt(req.query.limit)

    const products = manager.getProducts()

    if(isNaN(limit)) {
        res.json(products)
    } else {
        res.json(products.slice(0, limit))
    }
})

app.get('/products/:pid', (req, res) => {
    const productId = parseInt(req.params.pid)
    const product = manager.getProductById(productId)

    if (product) {
        res.json(product)
    } else {
        res.status(404).json({ error: "Product not found" })
    }
 })

 const PORT = 8080
 app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
 }).on('error', (error) => {
    console.error('Server error')
 })