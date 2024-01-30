const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const noteSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: function (value) {
        if (value.length < 8) {
          return false
        }

        if ((value.match(/-/g) || []).length !== 1) {
          return false
        }

        const prefix = value.split('-')[0]
        if (!/^\d+$/.test(prefix) || prefix.length < 2 || prefix.length > 3) {
          return false
        }

        const rest = value.split('-')[1]
        return /^\d+$/.test(rest)
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: true
  }
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema)
