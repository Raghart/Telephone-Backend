const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Entry = require('./mongoose-backend')
const app = express();
const path = require('path');

app.use(cors());
app.use(express.json());

morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));


app.get('/api/persons', (req, res, next) => {
    Entry.find({}).then(entries => {
        res.json(entries)
    })
    .catch(error => next(error));
});

app.put('/api/persons/:id', (req,  res, next) => {
    const body = req.body

    const entry = {
        name: body.name,
        number: body.number
    }

    Entry.findByIdAndUpdate(req.params.id, entry, {new: true})
    .then(updatedEntry => {
        res.json(updatedEntry)
    })
    .catch(error => next(error))
});

app.get('/api/persons/:id', (req, res, next) => {
    Entry.findById(req.params.id)
    .then(entry => {
        res.json(entry)
    })
    .catch(error => next(error))
});

app.post('/api/persons', (req, res, next) => {
    const body = req.body;
    if (!body.name || !body.number) {
        return res.status(400).json({ error: 'name or number missing' });
    }

    const entry = new Entry ({
        name: body.name,
        number: body.number
    })

    console.log(`${entry.name} ${entry.number}`)

    entry.save().then(result => {
        console.log(`Entry added!`)
        res.json(entry)
    })
    .catch(error => next(error))
});

app.delete('/api/persons/:id', (req, res, next) => {
    Entry.findByIdAndDelete(req.params.id)
    .then(result => {
        res.status(204).end()
    })
    .catch(error => next(error))
});

app.get('/info', (req, res) => res.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${new Date()}</p>`))

app.use(express.static(path.join(__dirname)));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.use((error, req , res, next) => {
    console.error(error.message);
    if (error.name === 'ValidationError') {
        return res.status(400).send({error: error.message})
    }
    next(error);
})

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});