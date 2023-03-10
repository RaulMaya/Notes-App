const express = require("express");
const path = require("path");
const api = require("./routes/index.js");
const { clog } = require("./middleware/clog");

const PORT = process.env.PORT || 3001;
const app = express();

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true })); // Telling your information is encoded
app.use(express.json());

// .use usally is to include a Middleware.
// A Middleware is a function/logic that is going to be executed after we get the request but before it finish.
// This are fixed files, static files.
app.use(express.static("public"));
// Import custom middleware, "cLog"
app.use(clog);

app.use("/api", api);

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "public/index.html"))
);

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public/pages/notes.html"))
);

// Fallback route for when a user attempts to visit routes that don't exist
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "public/pages/404.html"))
);

//Tell express top start listeting
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
