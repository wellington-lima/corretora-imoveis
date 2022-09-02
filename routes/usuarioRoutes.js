import express from 'express'
import { formularioLogin, autenticar, formularioCadastro, cadastrar, confirmar, formularioRecuperarSenha, resetPassword,
        confirmarToken, novaSenha } from '../controllers/usuarioController.js'

const router = express.Router()

router.get('/login', formularioLogin)
router.post('/login', autenticar)

router.get('/cadastro', formularioCadastro)
router.post('/cadastro', cadastrar)

router.get('/confirmar/:token', confirmar)

router.get('/recuperar-senha', formularioRecuperarSenha)
router.post('/recuperar-senha', resetPassword)


//Guardar nova senha
router.get('/recuperar-senha/:token', confirmarToken)
router.post('/recuperar-senha/:token', novaSenha)

export default router