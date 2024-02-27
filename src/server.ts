import express, { Express, Request, Response } from "express";
import path from "path";

const app: Express = express();

app.use(express.static(path.join(__dirname, "..", "views")));
app.use(express.static("dist"));

app.use(express.static("dist/views"));
app.get("/", (req, res) => {
  res.sendFile("dist/views/index.html");
});

const PORT: number | string = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
