import { readFileSync, writeFileSync } from 'fs';

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = [];
    this.loadProducts()
  }

  loadProducts() {
    try {
      const data = readFileSync(this.path, 'utf8')
      this.products = JSON.parse(data);
    } catch (error) {
      this.products = []
    }
  }

  saveProducts() {
    writeFileSync(this.path, JSON.stringify(this.products, null, 2), 'utf8')
  }

  addProduct(product) {
    const newProduct = {
      ...product,
      id: this.products.length > 0 ? this.products[this.products.length - 1].id + 1 : 1,
    }

    this.products.push(newProduct);
    this.saveProducts()
  }

  getProducts() {
    return this.products
  }

  getProductById(id) {
    const product = this.products.find(p => p.id === id);
    return product || null
  }

  updateProduct(id, updatedProduct) {
    const index = this.products.findIndex(p => p.id === id)
    if (index !== -1) {
      this.products[index] = { ...updatedProduct, id };
      this.saveProducts();
      return true
    }
    return false
  }

  deleteProduct(id) {
    const index = this.products.findIndex(p => p.id === id)
    if (index !== -1) {
      this.products.splice(index, 1);
      this.saveProducts();
      return true
    }
    return false
  }
}

// Ejemplo de uso
const manager = new ProductManager('products.json')

// Agrego Productos
manager.addProduct({
  title: 'Product 1',
  description: 'Description of product 1',
  price: 10,
  thumbnail: 'ruta/imagen1.jpg',
  code: 'P1',
  stock: 5
})

manager.addProduct({
  title: 'Product 2',
  description: 'Description of product 2',
  price: 15,
  thumbnail: 'ruta/imagen2.jpg',
  code: 'P2',
  stock: 8
})

// Obtengo todos los productos
const products = manager.getProducts()
console.log(products)

// Obtener por id
const product = manager.getProductById(1)
console.log(product)

// Actualizar por id
const updatedProduct = {
  title: 'Updated Product 1',
  description: 'Updated description of product 1',
  price: 20,
  thumbnail: 'ruta/imagen1_updated.jpg',
  code: 'P1',
  stock: 10
}
const isUpdated = manager.updateProduct(1, updatedProduct)
console.log(isUpdated) 

// Borrar por id
const isDeleted = manager.deleteProduct(2)
console.log(isDeleted) 
