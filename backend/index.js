import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth.js";
import { userRouter } from "./routes/user.js";
import { productRouter } from "./routes/product.js";
import { categoryRouter } from "./routes/category.js";
import { orderRouter } from "./routes/order.js";
import { addToCartRouter } from "./routes/addToCart.js";
import { addressRouter } from "./routes/address.js";
import { productImageRouter } from "./routes/productImage.js";
import { productVarietyRouter } from "./routes/productVariety.js";
import { brandRouter } from "./routes/brand.js";
import { offerRouter } from "./routes/offer.js";

const app = express();
const PORT = 8000;

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"], // React frontend
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));

app.get("/", (req, res) => {
  return res.send("Hello Ecommerce!");
});

// My routes end point
app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", productRouter);
app.use("/api", categoryRouter);
app.use("/api", orderRouter);
app.use("/api", addToCartRouter);
app.use("/api", addressRouter);
app.use("/api", productImageRouter);
app.use("/api", productVarietyRouter);
app.use("/api", brandRouter);
app.use("/api", offerRouter);
