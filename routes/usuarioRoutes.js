import express from 'express'
import { formularioLogin, formularioCadastro, cadastrar, confirmar, formularioRecuperarSenha } from '../controllers/usuarioController.js'

const router = express.Router()

router.get('/login', formularioLogin)
router.get('/cadastro', formularioCadastro)
router.post('/cadastro', cadastrar)
router.get('/confirmar/:token', confirmar)
router.get('/recuperar-senha', formularioRecuperarSenha)

export default router