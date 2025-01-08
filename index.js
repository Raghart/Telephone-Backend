const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

const path = require('path');
app.use(express.static(path.join(__dirname)));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

let persons = [
    { id: 1, name: "Arto Hellas", number: "040-123456" },
    { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
    { id: 3, name: "Dan Abramov", number: "12-43-234345" },
    { id: 4, name: "Mary Poppendieck", number: "39-23-6423122" }
];

app.get('/api/persons', (req, res) => {
    console.log('GET /api/persons');
    res.json(persons)
})

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.put('/api/persons/:id', (req,  res) => {
    const id = Number(req.params.id);
    const {name, number } = req.body;

    const person = persons.find(p => p.id === id);
    if (person) {
        person.name = name;
        person.number = number;
        res.json(person);
    } else {
        res.status(404).end();
    }
});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(person => person.id === id);
    
    if (person) {
        res.json(person);
    } else {
        res.status(404).end()
    }
});

app.post('/api/persons', (req, res) => {
    const body = req.body;
    if (!body.name || !body.number) {
        return res.status(400).json({ error: 'name or number missing' });
    }
    else if (persons.find(person => person.name === body.name)) {
        return res.status(400).json({ error: 'Name must be unique' });
    }

    const newPerson = {
        id: Math.floor(Math.random() * 100000),
        name: body.name,
        number: body.number
    };

    persons = persons.concat(newPerson);
    res.json(newPerson);
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(person => person.id !== id);
    res.status(204).end();
});

app.get('/info', (req, res) => res.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${new Date()}</p>`))

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
