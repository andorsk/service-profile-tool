const express = require("express");
const path = require("path");
const app = express();

// Serve static files from both 'views' and 'dist' directories
app.use(express.static("views"));
app.use(express.static("dist"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
