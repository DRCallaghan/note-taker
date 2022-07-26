const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { readAndAppend, readFromFile, writeToFile } = require('../helpers/fsUtils');

// GET route for displaying existing notes in the lefthand column
notes.get('/', (req, res) =>
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
);

// POST route for adding a new note to the db
notes.post('/', (req, res) => {
    // destructuring req body json object
    const { title, text } = req.body;

    // if all properties are present
    if (title && text) {
        // variable for the object we will save
        const newNote = {
            title,
            text,
            id: uuidv4(),
        };

        readAndAppend(newNote, './db/db.json');

        const response = {
            status: 'success',
            body: newNote,
        };

        res.json(response);
    } else {
        res.json('Error in posting note');
    }
});

// DELETE route for specific note
notes.delete('/:id', (req, res) => {
    const noteId = req.params.id;
    readFromFile('./db/db.json')
        .then((data) => JSON.parse(data))
        .then((json) => {
            // make a new array of all notes except the one provided in the url
            const result = json.filter((note) => note.id !== noteId);

            // save that array to the db
            writeToFile('./db/db.json', result);

            // respond to the DELETE request
            res.json(`Item ${noteId} has been deleted 🗑️`);
        });
});

module.exports = notes;