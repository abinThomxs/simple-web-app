const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

mongoose.connect('mongodb://127.0.0.1:27017/userData', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})



module.exports = mongoose.model('user', userSchema, "users")
