/**
 * A product.
 * @class
 */
export class Product {
    constructor(obj) {
        this.code  = Number(obj.code);
        this.name  = String(obj.name);
        this.price = Number(obj.price);
    }
}

/**
 * The list of products in a purchase.
 * @class
 */
export default class ProductList {
    /** Creates a new ProductList.
     */
    constructor() {
        this.id = 1;
        this.products = new Map();
    }

    /**
     * Add a product.
     * @param {Product} product - The product to be added.
     * @return {number} The product ID.
     */
    add(product) {
        this.products.set(this.id, product);
        const id = this.id;
        this.id++;
        return id;
    }

    /**
     * Remove a product.
     * @param {number} id - The ID of the product to be removed.
     * @return {boolean} Whether a product is removed or not.
     */
    remove(id) {
        return this.products.delete(id);
    }

    /**
     * List all prodcuts.
     * @return {Array} The list of products.
     */
    values() {
        const array = [];
        for (const key of this.products.keys()) {
            array.push([key, this.products.get(key)]);
        }
        return array;
    }

    /**
     * Get the price of everything.
     * @return {number} The price (0.00 format).
     */
    price() {
        return this.values()
            .map((x) => x[1]) 
            .reduce((acc, x) => acc + x.price, 0)
            .toFixed(2);
    }
}
