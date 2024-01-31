import conection from './conection.js'


const db = async () => {
    try {
        await conection.execute(`
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                content TEXT,
                fecha DATETIME,
                userName TEXT
            )
        `)

        await conection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id_user INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                apellido TEXT,
                user TEXT
            )
        `)
    } catch (error) {
        console.error('Error creating tables:', error.message)
    }
}


export default db