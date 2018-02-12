const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('post_data', function (req) { return JSON.stringify(req.body) })

app.use(bodyParser.json())
app.use(morgan(':method :url :post_data :status :res[content-length] - :response-time ms'))
app.use(cors())
app.use(express.static('build'))


app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  Person
    .find({}, { __v: 0 })
    .then(persons => {
      res.json(persons.map(Person.format))
    })
    .catch(error => {
      res.status(404).end()
    })
})

app.get('/info', (req, res) => {
  Person.count({})
    .then(cnt => {
      res.send(`<p>puhelinluettelossa on ${cnt} henkilön tiedot</p>
    <p>${new Date()}</p>`)
    })
})

app.get('/api/persons/:id', (request, response) => {
  Person
    .findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(Person.format(person))
      }
      else {
        response.status(404).end()
      }
    })
    .catch(error => {
      res.status(400).send({ error: 'malformed id' })
    })
})

const generateId = () => {
  return Math.floor(Math.random() * 10000)
}
const nameIsUniq = (name) => {
  const p = persons.filter(person => person.name === name)
  if (p.length === 0) {
    return true
  }
  else {
    return false
  }
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined || body.number === undefined) {

    return response.status(400).json({ error: 'name or number missing' })

  }
  if (!nameIsUniq(body.name)) {
    return response.status(400).json({ error: 'name must be unique' })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person
    .save()
    .then(Person.format)
    .then(savedPerson => {
      response.json(format(savedPerson))
    })
    .catch(error => {
      if (error.name === 'BulkWriteError') {
        response.status(400).send(
          { error: 'person exists' })
      }
      else {
        response.status(400).send({ error: 'malformed data' })
      }
    })
})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(() => {
      response.status(400).send({ error: 'malformed id' })
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})