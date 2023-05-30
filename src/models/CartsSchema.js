import mongoose from "mongoose";

export const cartsSchema = new mongoose.Schema({
  products: [
    {
      producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
      },
      cantidad: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
});
