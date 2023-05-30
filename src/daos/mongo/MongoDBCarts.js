import MongoClass from "./MongoClass.js";
import { cartsSchema } from "../../models/CartsSchema.js";

export class MongoDBCarts extends MongoClass {
  constructor() {
    super("carts", cartsSchema);
  }

  // sobreescribe el metodo getAll de la clase padre
  async getAll() {
    // traer el carrito con los productos usando populate
    const carritos = await this.collection.find({}).populate({
      path: "products",
      populate: { path: "_id", model: "products" },
    });
    return carritos;
  }

  async getOne(id) {
    try {
      const one = await this.collection.findById(id).populate({
        path: "products",
        populate: { path: "_id", model: "products" },
      });
      return one;
    } catch (err) {
      throw new Error(err);
    }
  }

  async addProductos(cart, product) {
    // chequear si el producto ya esta en el carrito
    const allProducts = cart.products;
    const productExists = allProducts.find(
      (p) => p._id._id.valueOf() == product._id.valueOf()
    );
    if (productExists) {
      productExists.quantity++;
    } else {
      cart.products.push({ _id: product._id, quantity: 1 });
    }
    const cartUpdated = await this.collection.findByIdAndUpdate(cart._id, {
      products: cart.products,
    });
    return cartUpdated;
  }

  async deleteProducto(carrito, productoId) {
    const productoEnCarrito = carrito.productos.find(
      (p) => p._id == productoId
    );
    if (productoEnCarrito) {
      productoEnCarrito.cantidad > 1
        ? productoEnCarrito.cantidad--
        : (carrito.productos = carrito.productos.filter(
            (p) => p._id != productoId
          ));
    } else {
      throw new Error("El producto no esta en el carrito");
    }
    const carritoUpdated = await this.collection.findByIdAndUpdate(
      carrito._id,
      { productos: carrito.productos }
    );
    return carritoUpdated;
  }
}
