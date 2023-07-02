import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet, { crossOriginResourcePolicy } from "helmet";
import morgan from "morgan";

import path from "path";
import { fileURLToPath } from "url";

// logic imports
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";

import authRoute from "./routes/auth.js";
import userRoute from "./routes/users.js";
import postRoute from "./routes/posts.js";

import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";

import { verifyToken } from "./middleWare/auth.js";

// Configutaion
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// File Storage

const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Routes with file

app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

app.use("/auth", authRoute);
app.use("/users", userRoute);
app.use("/posts", postRoute);

// Mongoose setup
const PORT = process.env.PORT || 8800;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is connected! ${PORT}`);
    });

// Add data one time
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((err) => {
    console.log("didn't connected to server", err);
  });
