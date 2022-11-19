const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const { v4: uuidv4}  = require('uuid');
const { json } = require('express');

const app = express();

const PORT = process.env.PORT || 3001; 

let notesSaved = []; 

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received for feedback`);
    notesSaved = fs.readFileSync("./db/db.json", "utf-8");
    notesSaved = JSON.parse(notesSaved);
    res.json(notesSaved);
});

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received notes`);
    notesSaved = fs.readFileSync("./db/db.json", "utf-8");
    notesSaved = JSON.parse(notesSaved);

    const { title, text } = req.body;
    if (title && text) {
        const newNote=  {
            title, 
            text, 
            id: uuidv4(),
        };

        notesSaved.push(newNote);
        notesSaved = JSON.stringify(notesSaved);
        fs.writeFile('./db/db.json', notesSaved, (err) =>
            err
                ? console.error(err)
                : console.log('Note has been Submitted')
            );
        const response = {
            status: 'Successful submission', 
            body: newNote,
        };

        res.json(response);
    }   else {
        res.json('Submission unsuccessful');
    }
});

app.delete
