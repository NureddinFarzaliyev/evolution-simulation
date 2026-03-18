import express from "express";
import cors from "cors";
import { geneticRouter } from "./routers/geneticRouter";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/genetic", geneticRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
