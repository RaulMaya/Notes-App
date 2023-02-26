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

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true })); // Telling your information is encoded
app.use(express.json());

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "public/index.html"))
);

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public/notes.html"))
);

// GET request
app.get("/api/notes", (req, res) => {
  return res.json(dbTest);
});

// POST request
app.post("/api/notes", (req, res) => {
  // Let the client know that their POST request was received
  console.log(req.body)

  // Show the user agent information in the terminal
  console.info(req.rawHeaders);

  // Log our request to the terminal
  console.info(`${req.method} request received`);
});

// GET route that returns any specific term
app.get("/api/:title", (req, res) => {
  // Coerce the specific search term to lowercase
  const requestedTitle = req.params.title.toLowerCase();

  // Iterate through the terms name to check if it matches `req.params.term`
  for (let i = 0; i < dbTest.length; i++) {
    if (requestedTitle === dbTest[i].title.toLowerCase()) {
      return res.json(dbTest[i]);
    }
  }

  // Return a message if the term doesn't exist in our DB
  return res.json("No match found");
});

// Return a list of titles
app.get("/titles", (req, res) => {
  const titles = dbTest.map((t) => t.title);

  const result = titles.filter((t, i) => titles.indexOf(t) === i);

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
