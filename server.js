const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");
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

// Promise version of fs.readFile
const readFromFile = util.promisify(fs.readFile);

/**
 *  Function to write data to the JSON file given a destination and some content
 *  @param {string} destination The file you want to write to.
 *  @param {object} content The content you want to write to the file.
 *  @returns {void} Nothing
 */
const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

/**
 *  Function to read data from a given a file and append some content
 *  @param {object} content The content you want to append to the file.
 *  @param {string} file The path to the file you want to save to.
 *  @returns {void} Nothing
 */
const readAndAppend = (content, file) => {
  fs.readFile(file, "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};

// GET request
app.get("/api/notes", (req, res) => {
  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

// POST request
app.post("/api/notes", (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a review`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newReview = {
      title,
      text,
    };

    readAndAppend(newReview, "./db/db.json");
    res.json(`Note added successfully 🚀`);
  } else {
    res.error("Error in adding note");
  }
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
