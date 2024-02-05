import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import logger from 'morgan'
import { Server } from 'socket.io'
import { createServer } from 'node:http'
import db from './db/db.js'
import endPoint from './modules/endPoint.js'

dotenv.config()
await db()
const port = process.env.PORT || 3000
const app = express()
const server = createServer(app)
const io = new Server(server, {
    connectionStateRecovery: {}
})
app.use(cors())
endPoint(io)
app.use(logger('dev'))
server.listen(port, '0.0.0.0', () => {
    console.log(`Servidor express corriendo en el puerto ${port}`)
})