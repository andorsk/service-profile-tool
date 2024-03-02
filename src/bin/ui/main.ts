import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// When using ES modules, __dirname is not defined. Use this workaround:
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

// Adjust the path according to where your 'index.html' is located
const publicDirectoryPath = __dirname; //join(__dirname, "public");

// Serve static files from 'public' directory
app.use(express.static(publicDirectoryPath));

app.get("/", (req, res) => {
  res.sendFile("views/index.html", { root: publicDirectoryPath });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
