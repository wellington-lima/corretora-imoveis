import { check, validationResult } from 'express-validator'
import Usuario from '../models/Usuario.js'
import { gerarId } from '../helpers/tokens.js'
import { emailCacastro } from '../helpers/emails.js'

const formularioLogin = (req, res) => {
  res.render('auth/login', { 
    pagina: 'Iniciar sessão'
  })
}

const formularioCadastro = (req, res) => {
  res.render('auth/cadastro', {
    pagina: 'Criar conta'
  })
}

const cadastrar = async(req, res) => {
  //Valdar campos
  await check('nome').notEmpty().withMessage('O nome não pode ser nulo').run(req)
  await check('email').isEmail().withMessage('Digite um e-mail válido').run(req)
  await check('password').isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres').run(req)
  await check('confirmar_password').custom((value, { req }) => value === req.body.password).withMessage('As senhas não coincidem ').run(req)

  let resultado = validationResult(req)

  if (!resultado.isEmpty()) {
    return res.render('auth/cadastro', {
      pagina: 'Criar conta',
      erros: resultado.array(),
      usuario: {
        nome: req.body.nome,
        email: req.body.email,
      }
    })
  }

  const { nome, email, password } = req.body
  const existeUsuario = await Usuario.findOne({ where: { email }})

  if(existeUsuario) {
    return res.render('auth/cadastro', {
      pagina: 'Criar conta',
      erros: [{ msg: 'Usuário já está cadastrado'}],
      usuario: {
        nome: req.body.nome,
        email: req.body.email,
      }
    })
  }

  //Cria usuario
  const usuario = await Usuario.create({
    nome,
    email,
    password,
    token: gerarId()
  })

  //Envia email de confirmação
  emailCacastro({
    nome: usuario.nome,
    email: usuario.email,
    token: usuario.token
  })
  
  
  //Mostrar mensagem de confirmação
  res.render('templates/mensagem', {
    pagina: 'Conta criada corretamente',
    mensagem: 'Um e-mail de confirmação foi enviado, clique no link'
  })
}

const confirmar = (req, res) => {
  const { token } = req.params
  console.log(token)
}

const formularioRecuperarSenha = (req, res) => {
  res.render('auth/recuperar-senha', {
    pagina: 'Recuperar senha'
  })
}

export {
  formularioLogin,
  formularioCadastro,
  cadastrar,
  confirmar,
  formularioRecuperarSenha
}