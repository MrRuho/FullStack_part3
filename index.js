require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const Note = require('./models/note')
const cors = require('cors')

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message })
    }
  
    next(error)
}

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

app.use((request, response, next) => {
    if (request.method === 'POST') {
      console.log(request.body)
    }
    next()
})
  
app.use(morgan('dev'))
  
app.get('/api/persons', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})

app.get('/api/info', (request, response) => {
    Note.find({}).then(notes => {
        const now = new Date()
        const Time = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Helsinki" }))

        const info = `Phonebook has info for ${notes.length} people.<br><br>Request made at ${Time.toLocaleString()}`
        response.send(info)
    }).catch(error => {
        console.error(error.message);
        response.status(500).send({ error: 'Internal Server Error' })
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Note.findById(request.params.id)
        .then(person => {
            if(person){
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) =>{
    Note.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) =>{
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({ 
            error: 'content missing' 
        })
    }

    const person = new Note({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson =>{
        response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const id = request.params.id

    Note.findByIdAndUpdate(
        id, 
        { number: body.number },
        { new: true }
    )
        .then(updatedPerson => { 
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
