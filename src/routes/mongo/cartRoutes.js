import { Router } from "express";
const router = Router();
import { MongoDBCarts } from "../../daos/mongo/MongoDBCarts.js";
import { MongoDBProducts } from "../../daos/mongo/MongoDBProducts.js";

const db = new MongoDBCarts();
const dbProducts = new MongoDBProducts();

router.post("/", async (req, res) => {
  /**Crea un carrito vacío de productos.
   * No le envío body->creo un carrito a partir del schema.
   */
  try {
    const cartCreated = await db.create();
    cartCreated
      ? res.status(201).json({
          status: "success",
          payload: cartCreated,
        })
      : res.json({
          status: "error",
        });
  } catch (err) {
    res.status(err.status || 500).json({
      status: "error",
      payload: err.message,
    });
  }
});

router.get("/", async (req, res) => {
  /**Devuelve todos los carritos */
  try {
    const allCarts = await db.getAll();
    allCarts
      ? res.status(200).json({
          status: "success",
          payload: allCarts,
        })
      : res.status(200).json({
          status: "success",
          payload: [],
        });
  } catch (err) {
    res.status(err.status || 500).json({
      status: "error",
      payload: err.message,
    });
  }
});

router.get("/:idCart/products", async (req, res) => {
  /**Devuelve los productos de un carrito por id */
  try {
    const idCart = req.params.idCart;
    const cart = await db.getOne(idCart);
    cart
      ? res.status(200).json({
          status: "success",
          payload: cart.products,
        })
      : res.status(404).json({
          status: "error",
          message: "Sorry, no cart found by id: " + idCart,
          payload: {},
        });
  } catch (err) {
    res.status(err.status || 500).json({
      status: "error",
      payload: err.message,
    });
  }
});

//agregar productos a un carrito
router.put("/:idCart/products/:idProduct", async (req, res) => {
  try {
    const cart = await db.getOne(req.params.idCart);
    const product = await dbProducts.getOne(req.params.idProduct);

    if (cart && product) {
      const cartUpdated = await db.addProductos(cart, product);
      const response = await db.getOne(cartUpdated._id);
      res.status(201).json({
        status: "success",
        payload: response,
      });
    } else {
      res.status(404).json({ message: "Missing data" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message, line: err.line });
  }
});

export default router;
