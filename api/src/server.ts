import express from "express";
import cors from "cors";
import { geneticRouter } from "./routers/geneticRouter";
import { gotohRouter } from "./routers/gotohRouter";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/genetic", geneticRouter);
app.use("/gotoh", gotohRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
