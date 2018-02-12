const mongoose = require('mongoose')

//dbuser ja dbpassword tilalle käyttäjä ja tunnus 
const url = 'mongodb://dbuser:dbpassword@ds133558.mlab.com:33558/fullstack'

mongoose.connect(url)
mongoose.Promise = global.Promise

const Person = mongoose.model('Person', {
    name: String,
    number: String
})

if (process.argv[2] && process.argv[3]) {
    const person = new Person({
        name: process.argv[2],
        number: process.argv[3]
    })

    person
        .save()
        .then(response => {
            console.log('henkilö lisätty kantaan')
            mongoose.connection.close()
        })
} else {
    console.log('puhelinluettelo:')
    Person
        .find({})
        .then(result => {
            result.forEach(person => {
                console.log(`${person.name} ${person.number}`)
            })
            mongoose.connection.close()
        })
}