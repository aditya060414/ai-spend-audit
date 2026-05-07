import express from "express";
import dotenv from "dotenv"
import mongoose from "mongoose"
import cors from "cors"

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL! as string;


app.use(cors());
app.use(express.json());


const connect = async () => {
    try {
        if (!MONGO_URL) {
            console.log("MongoDB URL is not defined")
        }

        await mongoose.connect(MONGO_URL);
        console.log("Connected to DB");

        app.listen(PORT, () => {
            console.log(`Server is live on port ${PORT}`)
        })

    } catch (error) {
        console.log(`MongoDB connection error ${error}`);
        process.exit(1);
    }
}


app.get("/", (req, res) => {
    res.send("ai-spend-audit");
});

connect();