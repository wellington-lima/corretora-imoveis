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

export { 
  emailCacastro
}