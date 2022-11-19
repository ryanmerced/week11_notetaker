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

app.delete('/api/notes/:id', (req, res) => {
    console.info(`${req.method} request received to delete note`);
    notesSaved = fs.readFileSync("./db/db.json", "utf-8");
    notesSaved = JSON.parse(notesSaved);
    for(let i = 0; i < notesSaved.lenght; i++) {
        if (notesSaved[i].id == req.params.id) {
            console.log('Removed Note');
             notesSaved.splice(i, 1);
        }
    }
    console.log(notesSaved);
    notesSaved = JSON.stringify(notesSaved);
    fs.writeFile("./db/db.json", notesSaved, "utf-8", (err) =>
    err
        ? console.error(err)
        : console.log(`Note Deleted`)
    );
    res.json(notesSaved);
});

app.get('/*', (req, res) =>
    res.status(404).sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);
