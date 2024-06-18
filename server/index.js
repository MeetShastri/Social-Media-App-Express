import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import {register} from './controllers/auth.js';
import {addPost} from './controllers/post.js';
import authRoutes from './routes/authroutes.js';
import userRoutes from './routes/userroutes.js';
import postRoutes from './routes/postroutes.js';
import { verifyToken } from "./middleware/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
dotenv.config();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), addPost);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);


const PORT = process.env.PORT || 6001;
mongoose
    .connect(process.env.MONGO_URL, {
    })
    .then(() => {
        app.listen(PORT, () => console.log(`Server Port: ${PORT}`));    
    })
    .catch((error) => console.log(`${error} did not connect`));
