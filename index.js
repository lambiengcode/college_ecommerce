import http from 'http'
import cors from 'cors'
import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { connectDatabase } from './common/connectDB'
// Routes
import Auth from './routes/auth'
import User from './routes/user'
import Test from './routes/test'

import i18n from 'i18n'
require('dotenv').config()

// Setup server express
const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())
app.use(bodyParser.json({ limit: '100mb' }))
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }))
app.use(cookieParser())

app.get('/api/info', (req, res) => {
  res.json('welcome to test !')
})

app.use('/auth', Auth)
app.use('/api/user', User)
app.use('/api/test', Test)

// error handler
app.use(function (err, req, res, next) {
  if (err.isBoom) {
    return res.status(err.output.statusCode).json(err.output.payload)
  }
})

i18n.configure({
  locales: ['en', 'vi'],
  directory: './locales'
})

const server = http.createServer(app)

// Database connection
connectDatabase()

server.listen(process.env.PORT)

console.log('Server run on port ' + process.env.PORT)
