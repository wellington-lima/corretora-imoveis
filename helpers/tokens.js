import jwt from 'jsonwebtoken'

const gerarToken = dados => jwt.sign({
   id: dados.id,
   nome: dados.nome
  }, process.env.JWT_SECRET, { expiresIn: '1d' })

const gerarId = () => Math.random().toString(32).substring(2) + Date.now().toString(32)

export { 
  gerarToken,
  gerarId
}