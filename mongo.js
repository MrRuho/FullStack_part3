const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Usage: node mongo.js <password> <name> <number>')
  process.exit(1)
}

const password = process.argv[2]

const url =
`mongodb+srv://paaville:${password}@cluster0.6mpk9gp.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Note = mongoose.model('Note', noteSchema)

if (process.argv.length === 3){
  Note.find({}).then(result => {
    console.log('Phonebook:')
    result.forEach(note => {
      console.log(`${note.name} ${note.number}`)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length === 5){
  const name = process.argv[3]
  const number = process.argv[4]

  const newNote = new Note({
    name: name,
    number: number
  })

  newNote.save().then(() => {
    console.log(`Added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  console.log('Invalid number of arguments')
  process.exit(1)
}
