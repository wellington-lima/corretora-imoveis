
const admin = (req, res) => {
  res.render("propriedades/admin", {
    pagina: "Minhas propriedades",
    barra: true,
  });
}

//Formulario para criar novas propriedades
const criar = (req, res) => {
  res.render("propriedades/criar", {
    pagina: "Criar propriedades",
    barra: true,
  });
}

export {
  admin,
  criar
}