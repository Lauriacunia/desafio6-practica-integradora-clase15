import { Router } from "express";
const router = Router();
import ProductManager from "../persitence/productManager.js";
const path = "src/db/products.json";
const myProductManager = new ProductManager(path);
import { validateNumber } from "../utils/helpers.js";
import {
  validateRequest,
  validateNumberParams,
  validateCodeNotRepeated,
} from "../middleware/validators.js";

router.get("/", async (req, res) => {
  try {
    const products = await myProductManager.getProducts();
    const limit = req.query.limit;
    const isValidLimit = validateNumber(limit);
    products
      ? isValidLimit
        ? res.render("home", {
            products: products.slice(0, limit),
          })
        : res.render("home", {
            products: products,
          })
      : res.render("home", {
          products: [],
        });
  } catch (err) {
    res.status(err.status || 500).json({
      status: "error",
      payload: err.message,
    });
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await myProductManager.getProducts();
    const limit = req.query.limit;
    const isValidLimit = validateNumber(limit);
    products
      ? isValidLimit
        ? res.render("realTimeProducts", {
            products: products.slice(0, limit),
          })
        : res.render("realTimeProducts", {
            products: products,
          })
      : res.render("realTimeProducts", {
          products: [],
        });
  } catch (err) {
    res.status(err.status || 500).json({
      status: "error",
      payload: err.message,
    });
  }
});

export default router;
