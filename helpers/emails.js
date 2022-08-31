import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const emailCacastro = async(dados) => {

  var transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
  })

  const { email, nome, token } = dados

  //Enviar email
  await transport.sendMail({
    from: 'Corretora de Imóveis <corretora@email.com>',
    to: email,
    subject: 'Confirme sua conta na corretora',
    text: 'Confirme sua conta na corretora',
    html: `
      <p>Olá ${nome}, confirme sua conta na corretora de imóveis.
        Sua conta ja está criada, basta confirmá-la no seguinte link:
        <a href='${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}' title='Confirmar conta'>Confirmar Conta</a>
      </p>

      <p>Se você não criou uma conta, por favor, ignore essa mensagem.</p>
    `
  })
}

const emailRecuperarSenha = async(dados) => {

  var transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
  })

  const { email, nome, token } = dados

  //Enviar email
  await transport.sendMail({
    from: 'Corretora de Imóveis <corretora@email.com>',
    to: email,
    subject: 'Redefina sua senha na corretora',
    text: 'Redefina sua senha na corretora',
    html: `
      <p>Olá ${nome}, você solicitou redefinir sua senha na corretora de imóveis.
        Clique no seguinte link para definir uma nova senha:
        <a href='${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/recuperar-senha/${token}' title='Redefinir senha'>Redefinir senha</a>
      </p>

      <p>Se você não solicitou a alteração da senha, por favor, ignore essa mensagem.</p>
    `
  })
}

export { 
  emailCacastro,
  emailRecuperarSenha
}