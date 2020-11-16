const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.json())

const morganLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(morganLogger)

app.use(morgan('tiny'))

let today = new Date();

let  date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

let persons = [
  {
    id: 1,
    name: "John Smith",
    number: '0221'
  },
  {
    id: 2,
    name: "Jane Doe",
    number: '0222'
  },
  {
    id: 3,
    name: "John Smith",
    number: '0223'
  },
  {
    id: 4,
    name: "Snoop Dogg",
    number: '0224'
  }
]

const names = persons.map(person => person.name)

const numbers = persons.map(num => num.number)


app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  response.send(`There are ${persons.length} in the phone book: ${date}`)
  console.log(persons.length,date)
  response.json(persons)
})


app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const personsEntry = persons.find(persons => persons.id === id)

  if (personsEntry) {
    response.json(personsEntry)
  } else {
    response.status(404).send()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(persons => persons.id !== id)

  response.status(204).end()
})
//________________________________________________
const generateId = () => {
  const maxId = persons.length > 0
  ?  Math.floor(Math.random() * (10000 - 4 + 1)) + 4
  : 0
  return maxId + 1
}

app.post('/api/persons', (request, response) => {

  const body = request.body

  if (names.includes(body.name) || numbers.includes(body.number)) {
      response.status(400)
      throw new Error("this person already exist");
      return response.json('this person exist already')
  }

  if (!body.name || !body.number) {
      response.status(400)
      throw new Error("Missing name and/or number fields");
      return response.json('Missing name and number')
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number || 0
  }
  persons = persons.concat(person)
  response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
