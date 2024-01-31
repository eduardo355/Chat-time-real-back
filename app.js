import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import logger from 'morgan'
import { Server } from 'socket.io'
import { createServer } from 'node:http'
import db from './db/db.js'
import conection from './db/conection.js'

dotenv.config()

await db()
const port = process.env.PORT || 3000
const app = express();
const server = createServer(app)
const io = new Server(server, {
    connectionStateRecovery: {}
})

app.use(cors())

app.get('/' , (req, res) => {
    console.log('corriendo');
})

let conecctionUser = 0
io.on('connect', async (socket) => {
    console.log('Usuario Conectado')

    conecctionUser += 1

    io.emit('UserConnection', conecctionUser.toString());

    socket.on('disconnect', () => {
        conecctionUser -= 1;
        if (conecctionUser < 0) {
            conecctionUser = 0
        }
        io.emit('UserConnection', conecctionUser.toString());

        console.log('Usuario desconectado');
    })

    socket.on('Registro', async (name, apellido, user) => {
        let result
        try {
            result = await conection.execute({
                sql: 'INSERT INTO users (name, apellido, user) VALUES (:name, :apellido, :user)',
                args: {
                    name,
                    apellido,
                    user
                }
            })
            if (result.lastInsertRowid.toString()) {
                let user
                try {
                    let id_user = parseInt(result.lastInsertRowid.toString())
                    user = await conection.execute({
                        sql: 'SELECT * FROM users WHERE id_user = :id_user',
                        args: { id_user: id_user }
                    })
                    if (user.rows) {
                        socket.emit('Registro correcto', user.rows[0].id_user.toString(), user.rows[0].name.toString(), user.rows[0].apellido.toString(), user.rows[0].user.toString())
                    }
                } catch (error) {

                }
            }
        } catch (error) {
            console.error(error)
        }
    })

    socket.on('Guardar Mensaje', async (message, dateNow, userName) => {
        let result
        if (message) {
            try {
                result = await conection.execute({
                    sql: 'INSERT INTO messages (content, fecha, userName) VALUES (:message, :fecha, :userName)',
                    args: { message: message, fecha: dateNow, userName: userName}
                })
            } catch (error) {
                console.error(error)
                return
            }
            io.emit('Enviar Mensaje', message, result.lastInsertRowid.toString(), dateNow, userName)
        }
    })

    if (!socket.recovered) {
        try {
            const result = await conection.execute({
                sql: 'SELECT id, content, fecha, userName FROM messages WHERE id > ?',
                args: [socket.handshake.auth.serverOffset ?? 0]
            })
            result.rows.forEach(row => {
                socket.emit('Enviar Mensaje', row.content, row.id.toString(), row.fecha.toString, row.userName)
            })
        } catch (error) {

        }
    }
})

app.use(logger('dev'))
server.listen(port, '0.0.0.0', () => {
    console.log(`Servidor express corriendo en el puerto ${port}`)
})