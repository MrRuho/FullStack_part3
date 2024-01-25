const express = require('express')
const app = express()

app.use(express.json())

let persons = [
    {
      id: 1,
      name: "Arto Hellas",
      number: "040-123456"
    },
    {
      id: 2,
      name: "Veikko Kuusela",
      number: "06-555123"
    },
    {
      id: 3,
      name: "Tapani Kansa",
      number: "040-5546789"
    }
]
  
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/info', (request, response) => {
    const now = new Date();
    const Time = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Helsinki" }));

    const info = `Phonebook has info for ${persons.length} people.<br><br>Request made at ${Time.toLocaleString()}`;
    response.send(info)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = persons.find(person => person.id === id)
    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) =>{
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) =>{
    const randomId = Math.floor(Math.random() * 10000) + 1
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({ 
            error: 'content missing' 
        })
    }

    const isNameInList = persons.some((person) => person.name === body.name)
    if (isNameInList) {
        return response.status(400).json({ 
            error: 'name must be unique' 
        })
    }

    const person = {
        id: randomId,
        name: body.name,
        number: body.number
    }
    
    persons = persons.concat(person)
    
    response.json(person)

})


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})