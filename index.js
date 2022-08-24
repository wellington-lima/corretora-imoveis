import express from 'express'
import csrf from 'csurf'
import cookieParser from 'cookie-parser'
import usuarioRoutes from './routes/usuarioRoutes.js'
import db from './config/db.js'

const app = express()

//Conexao db
try {
  await db.authenticate()
  db.sync()
  console.log('Conectado a base de dados!')
} catch (error) {
  console.log(error);
}

//Habilita para receber os dados do formulario via request
app.use(express.urlencoded({ extended: true }))

//Habilitar Cookie Parser
app.use(cookieParser())

//Habilitar CSRF
app.use(csrf({ cookie: true }))

//Habilitar pug
app.set('view engine', 'pug')
app.set('views', './views')

//Pasta pública
app.use(express.static('public'))

app.use('/auth', usuarioRoutes)

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`Server started on port ${port}`))
