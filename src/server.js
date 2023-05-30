import express from "express";
import morgan from "morgan";
import { Server as SocketServer } from "socket.io";
import http from "http";
import homeRoutes from "./routes/homeRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import websockets from "./websockets/websockets.js";
import exphbs from "express-handlebars";
import { dirname } from "path";
import { fileURLToPath } from "url";

/** ★━━━━━━━━━━━★ variables ★━━━━━━━━━━━★ */

const app = express();
const PORT = 8080 || process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(__dirname);
/** ★━━━━━━━━━━━★ server httt & websocket ★━━━━━━━━━━━★ */

/** Tenemos dos servidores:  httpServer (http) y io (websocket)*/
const httpServer = http.createServer(app);

/** Crear nuevo servidor websocket */
const io = new SocketServer(httpServer);

websockets(io);

/** ★━━━━━━━━━━━★ middlewares ★━━━━━━━━━━━★*/
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

/** ★━━━━━━━━━━━★ frontend ★━━━━━━━━━━━★*/
app.engine("handlebars", exphbs.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

/** ★━━━━━━━━━━━★ routes ★━━━━━━━━━━━★ */
app.use("/", homeRoutes);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);

const server = httpServer.listen(PORT, () =>
  console.log(
    `🚀 Server started on port ${PORT}. 
      at ${new Date().toLocaleString()}`
  )
);
server.on("error", (err) => console.log(err));
