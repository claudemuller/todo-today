const express = require('express');
const app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser');
const uuid = require('uuid/v4');

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static(__dirname + '/static'));

app.get('/items', urlencodedParser, getItems);
app.post('/items', jsonParser, addItem);
app.put('/items/:id', jsonParser, updateItem);
app.delete('/items/:id', urlencodedParser, deleteItem);

app.get('/', function(req, res) {
    const done = todos.filter(t => t.done);
    const undone = todos.filter(t => !t.done);
    ejs.renderFile('src/templates/index.ejs', { done, undone }, {}, function(err, template) {
        if (err) {
            throw err;
        } else {
            res.end(template);
        }
    });
});

app.listen(3000, () => console.log('Listening on port 3000'));

const gracefulShutdown = () => {
    process.exit();
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown);

let todos = [
    { id: uuid(), todo: 'Swedish Flashcards :)', done: false },
];

function getItems(req, res) {
    res.send(todos);
}

function addItem(req, res) {
    const item = {
        id: uuid(),
        todo: req.body.todo,
        done: false,
    };

    todos.push(item);

    res.send(todos);
}

function deleteItem(req, res) {
    todos = todos.filter(t => t.id !== req.params.id);

    res.send(todos);
}

function updateItem(req, res) {
    let item = {};

    for (let i = 0; i < todos.length; i++) {
        item = todos[i];
        if (item.id === req.params.id) {
            item.done = req.body.done;
        }
    }

    res.send(todos);
}