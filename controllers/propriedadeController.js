
const admin = (req, res) => {
  res.render("propriedades/admin", {
    pagina: "Minhas propriedades"
  });
}

export {
  admin
}