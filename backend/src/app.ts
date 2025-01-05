import { errors } from 'celebrate'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import express, { json, urlencoded } from 'express'
import mongoose from 'mongoose'
import path from 'path'
import mongoSanitize  from 'express-mongo-sanitize'
import { DB_ADDRESS } from './config'
import errorHandler from './middlewares/error-handler'
import routes from './routes'
import limiter from './utils/limiter'

const { PORT = 3000, ORIGIN_ALLOW = 'http://localhost:5173' } = process.env
const app = express()

app.use(cookieParser())

app.use(cors({ origin: ORIGIN_ALLOW, credentials: true }));

app.use(express.static(path.join(__dirname, 'public')))
app.use(limiter);
app.use(urlencoded({ extended: true }))
app.use(json())
app.use(mongoSanitize());
app.options('*', cors())
app.use(routes)
app.use(errors())
app.use(errorHandler)

// eslint-disable-next-line no-console

const bootstrap = async () => {
    try {
        await mongoose.connect(DB_ADDRESS)
        await app.listen(PORT, () => console.log('ok'))
    } catch (error) {
        console.error(error)
    }
}

bootstrap()
