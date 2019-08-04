require('dotenv').config(); 
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const controller = require('./controller')
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

app.get('/api/v1/user/profile', controller.getUserProfile)
app.post('/api/v1/user/signin', controller.signInUser)
app.post('/api/v1/user/signup', controller.signUpUser)
app.put('/api/v1/user/profile/update', controller.updateProfile)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})