import { check, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import Usuario from '../models/Usuario.js'
import { gerarToken, gerarId } from '../helpers/tokens.js'
import { emailCacastro, emailRecuperarSenha } from '../helpers/emails.js'

const formularioLogin = (req, res) => {
  res.render('auth/login', { 
    pagina: 'Iniciar sessão',
    csrfToken: req.csrfToken()
  })
}

const autenticar = async (req, res) => {
  //Validar
  await check('email').isEmail().withMessage('Digite o e-mail').run(req)
  await check('senha').notEmpty().withMessage('Digite a senha').run(req)

  let resultado = validationResult(req)

  if (!resultado.isEmpty()) {
    return res.render('auth/login', {
      pagina: 'Iniciar sessão',
      csrfToken: req.csrfToken(),
      erros: resultado.array()
    })
  }

  //Verificar se o usuario existe
  const { email, senha } = req.body
  const usuario = await Usuario.findOne({ where: { email }})

  if(!usuario) {
    return res.render('auth/login', {
      pagina: 'Iniciar sessão',
      csrfToken: req.csrfToken(),
      erros: [{ msg: "O usuário não existe" }]
    })
  }

  //Verificar se o usuario está confirmado
  if(!usuario.confirmado) {
    return res.render('auth/login', {
      pagina: 'Iniciar sessão',
      csrfToken: req.csrfToken(),
      erros: [{ msg: "Sua conta não foi confirmada" }]
    })
  }

  //Verificar password
  if(!bcrypt.compareSync(senha, usuario.password)) {
    return res.render('auth/login', {
      pagina: 'Iniciar sessão',
      csrfToken: req.csrfToken(),
      erros: [{ msg: "A senha está incorreta" }]
    })
  }

  //Autenticar o usuario
  const token = gerarToken({ id: usuario.id, nome: usuario.nome })

  //Armazenar token em cookie
  return res.cookie('_token', token, {
    httpOlny: true,
    //secure: true,
    //sameSite: true
  }).redirect('/minhas-propriedades')
}

const formularioCadastro = (req, res) => {
  res.render('auth/cadastro', {
    pagina: 'Criar conta',
    csrfToken: req.csrfToken()
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
      csrfToken: req.csrfToken(),
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
      csrfToken: req.csrfToken(),
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

const confirmar = async (req, res) => {
  const { token } = req.params
  const usuario = await Usuario.findOne({ where: { token }})

  if(!usuario) {
    return res.render('auth/confirmar-conta', {
      pagina: 'Erro ao confirmar sua conta',
      mensagem: 'Houve um erro ao confirmar sua conta. Tente novamente',
      erro: true
    })
  }

  //Confirmar conta
  usuario.token = null
  usuario.confirmado = true
  await usuario.save()

  res.render('auth/confirmar-conta', {
    pagina: 'Conta confirmada',
    mensagem: 'Conta confirmada corretamente',
  })
}

const formularioRecuperarSenha = (req, res) => {
  res.render('auth/recuperar-senha', {
    pagina: 'Recuperar senha',
    csrfToken: req.csrfToken(),
    
  })
}

const resetPassword = async(req, res) => {
  //Valdar campos
  await check('email').isEmail().withMessage('Digite um e-mail válido').run(req)

  let resultado = validationResult(req)

  if (!resultado.isEmpty()) {
    return res.render('auth/recuperar-senha', {
      pagina: 'Recuperar senha',
      csrfToken: req.csrfToken(),
      erros: resultado.array()
    })
  }

  //Buscar usuario
  const { email } = req.body
  const usuario = await Usuario.findOne({ where: { email } })

  if(!usuario) {
    return res.render('auth/recuperar-senha', {
      pagina: 'Recuperar senha',
      csrfToken: req.csrfToken(),
      erros: [{ msg: 'E-mail não cadastrado' }]
    })
  }

  //Gerar token e enviar email
  usuario.token = gerarId()
  await usuario.save()

  //Enviar email
  emailRecuperarSenha({
    email: usuario.email,
    nome: usuario.nome,
    token: usuario.token
  })

  //Mostrar mensagem de confirmação
  res.render('templates/mensagem', {
    pagina: 'Redefina sua senha',
    mensagem: 'Enviamos um email com as instruções'
  })
}

const confirmarToken = async (req, res) => {
  const { token } = req.params
  const usuario = await Usuario.findOne({ where: { token }})

  if (!usuario) {
    return res.render('auth/confirmar-conta', {
      pagina: 'Redefina sua senha',
      mensagem: 'Houve um erro ao validar sua informação. Tente novamente',
      erro: true
    })
  }

  //Mostrar formulario para alterar senha
  res.render('auth/reset-senha', {
    pagina: 'Redefina sua senha',
    csrfToken: req.csrfToken()
  })

}

const novaSenha = async (req, res) => {
  //Validar senha
  await check('password').isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres').run(req)

  let resultado = validationResult(req)

  if (!resultado.isEmpty()) {
    return res.render('auth/reset-senha', {
      pagina: 'Redefinir senha',
      csrfToken: req.csrfToken(),
      erros: resultado.array()
    })
  }
  
  const { token } = req.params
  const { password } = req.body

  //busca o usuário
  const usuario = await Usuario.findOne({ where: { token }})

  //Redefinir senha
  const salt = await bcrypt.genSalt(10)
  usuario.password = await bcrypt.hash(password, salt)
  usuario.token = null

  await usuario.save()

  res.render('auth/confirmar-conta', {
    pagina: 'Senha redefinida',
    mensagem: 'A senha foi redefinida corretamente'
  })

}

export {
  formularioLogin,
  autenticar,
  formularioCadastro,
  cadastrar,
  confirmar,
  formularioRecuperarSenha,
  resetPassword,
  confirmarToken,
  novaSenha
}