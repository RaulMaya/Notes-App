const express = require("express");
const path = require("path");

// Importing my JSON File
const dbTest = require("./db/db.json");

const app = express();
const PORT = 3001;

// .use usally is to include a Middleware.
// A Middleware is a function/logic that is going to be executed after we get the request but before it finish.
// This are fixed files, static files.
app.use(express.static("public"));

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "public/index.html"))
);

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public/notes.html"))
);

app.get("/api", (req, res) => {
  res.json(dbTest);
});

// GET route that returns any specific term
app.get("/api/:term", (req, res) => {
  // Coerce the specific search term to lowercase
  const requestedTerm = req.params.term.toLowerCase();

  // Iterate through the terms name to check if it matches `req.params.term`
  for (let i = 0; i < dbTest.length; i++) {
    if (requestedTerm === dbTest[i].term.toLowerCase()) {
      return res.json(dbTest[i]);
    }
  }

  // Return a message if the term doesn't exist in our DB
  return res.json("No match found");
});

// Return a list of categories
app.get("/terms", (req, res) => {
  const terms = dbTest.map((term) => term.term);

  const result = terms.filter((t, i) => terms.indexOf(t) === i);

  return res.json(result);
});

// Fallback route for when a user attempts to visit routes that don't exist
app.get("*", (req, res) =>
  res.send(
    `Make a GET request using Insomnia to <a href="http://localhost:${PORT}/api">http://localhost:${PORT}/api</a>`
  )
);

//Tell express top start listeting
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
