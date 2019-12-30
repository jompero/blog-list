const config = require('./utils/config')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const loginRouter = require('./controllers/login')
const usersRouter = require('./controllers/users')
const blogsRouter = require('./controllers/blogs')

const middleware = require('./utils/middleware')

const connect = async () => {
  console.log('connecting to', config.MONGODB_URI)
  const mongoUrl = config.MONGODB_URI;
  
  try {
    await mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    console.log('connected to MongoDB')
  } catch (error) {
    console.log('error connection to MongoDB:', error.message)
  }
}
connect()

app.use(cors())
app.use(bodyParser.json())

app.use(middleware.tokenExtractor)
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)

app.use(middleware.errorHandler)

module.exports = app;