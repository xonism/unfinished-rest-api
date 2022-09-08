import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import subscribersRouter from './routes/subscribers.routes.js'

dotenv.config()

const DATABASE_URL = process.env.DATABASE_URL
const PORT = process.env.PORT

if (!DATABASE_URL) throw new Error('❌ Missing DATABASE_URL variable from .env file')

if (!PORT) throw new Error('❌ Missing PORT variable from .env file')

const app = express()

try {
  mongoose.connect(DATABASE_URL)
} catch (error) {
  console.error(error)
  throw new Error('❌ Unable to connect to database')
}

const database = mongoose.connection

database.on('error', (error) => console.error(error))

database.once('open', () => console.log('✅ Database open!'))

app.use(express.json())

app.use('/subscribers', subscribersRouter)

app.listen(PORT, () => console.log('✅ Server started!'))
