const express = require("express");
const router = express.Router();
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require("../helpers/fsUtils");
const uuid = require("../helpers/uuid");

// GET request
router.get("/", (req, res) => {
  readFromFile("./db/db.json").then((data) => {
    if (data.length === 0) {
      return
    } else {
      res.json(JSON.parse(data));
    }
  });
});

// POST request
router.post("/", (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a note`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newReview = {
      title,
      text,
      id: uuid(),
    };

    readAndAppend(newReview, "./db/db.json");
    res.json(`Note added successfully 🚀`);
  } else {
    res.error("Error in adding note");
  }
});

router.delete("/:id", (req, res) => {
  console.info(`${req.method} request received.`);
  readFromFile("./db/db.json").then((data) => {
    data = JSON.parse(data);
    for (let i = 0; i < data.length; i++) {
      const currentNote = data[i];
      console.log(currentNote);
      if (currentNote.id === req.params.id) {
        const noteObj = data.filter((note) => currentNote.id != note.id);

        writeToFile("./db/db.json", noteObj);
        readFromFile("./db/db.json").then((d) => {
          if (d.length === 0) {
            res.json(d);
          } else {
            res.json(JSON.parse(d));
          }
        });
      }
    }
    console.log("Fueras", req.params);
  });
});

module.exports = router;
console.log();
