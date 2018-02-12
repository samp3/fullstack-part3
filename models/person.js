const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const url = process.env.MONGODB_URI

mongoose.connect(url)
mongoose.Promise = global.Promise



const personSchema = new mongoose.Schema({
    id: Number,
    name: {
        type: String,
        unique: true
    },
    number: String
})

personSchema.statics.format = (person) => {
    return {
        name: person.name,
        number: person.number,
        id: person._id
    }
}


const Person = mongoose.model('Person', personSchema)

module.exports = Person