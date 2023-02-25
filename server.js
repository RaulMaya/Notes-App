const express = require('express');
const path = require('path');

const app = express();
const PORT = 3001;

// .use usally is to include a Middleware.
// A Middleware is a function/logic that is going to be executed after we get the request but before it finish.
// This are fixed files, static files.
app.use(express.static('public'));

app.get('/', (req, res) => 
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);