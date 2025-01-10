const mongoose = require('mongoose')

const password = process.argv[2]

const name = process.argv[3]

const number = process.argv[4]

console.log(password, name, number);

const url = `mongodb+srv://rafaelrojas36:${password}@cluster0.ptjey.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(url);

const entryData = new mongoose.Schema({
    name: String,
    number: String,
});

const Entry = mongoose.model('Entry', entryData);

const entry = new Entry({
    name: name,
    number: number
})

if (name && number) {
    entry.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
    .catch(error => {
        console.error('Error saving entry:', error)
        mongoose.connection.close()
    })
} else {
    Entry.find({}).then(result => {
        console.log('Phonebook:')
        result.forEach(entry => {
            console.log(`${entry.name} ${entry.number}`)
        })
        mongoose.connection.close()
    })
    .catch(error => {
        console.error('Error finding entries:', error)
        mongoose.connection.close()
    })
}
