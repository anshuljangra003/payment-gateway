
import router from "./router/index.js";
import express from "express"
import cors from "cors"

const app=express();
app.use(express.json());
app.use(cors());
app.use("/api/v1",router);

app.listen(3000)

