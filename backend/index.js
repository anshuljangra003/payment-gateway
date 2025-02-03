
import router from "./router/index.js";
import express from "express"

const app=express();
app.use(express.json());

app.use("/api/v1",router);

app.listen(3000)

