import { readFileSync, writeFileSync } from 'node:fs';

export class ProductManager {
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

