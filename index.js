require('dotenv').config(); 
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./queries')
const port = process.env.PORT

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

// app.get('/api/v1/user/:id', db.getUserById)
app.get('/api/v1/user/profile', db.getUserProfile)
app.post('/api/v1/user/signin', db.signInUser)
app.post('/api/v1/user/signup', db.signUpUser)
app.put('/api/v1/user/profile/update', db.updateProfile)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})