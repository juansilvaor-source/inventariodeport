const express = require("express"); 
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

let data = { usuarios: [] };

if (fs.existsSync("data.json")) {
  data = JSON.parse(fs.readFileSync("data.json"));
}

function guardarData(){
  fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
}

app.post("/registro", (req, res) => {
  const { nombre, correo, password } = req.body;

  let existe = data.usuarios.find(u => u.correo === correo);
  if(existe){
    return res.json({ mensaje: "Usuario ya existe" });
  }

  data.usuarios.push({
    nombre,
    correo,
    password,
    productos: []
  });

  guardarData();
  res.json({ mensaje: "Usuario creado" });
});

app.post("/login", (req, res) => {
  const { correo, password } = req.body;

  let user = data.usuarios.find(u => u.correo === correo);

  if(!user){
    return res.json({ ok:false, mensaje:"Usuario no existe" });
  }

  if(user.password !== password){
    return res.json({ ok:false, mensaje:"Contraseña incorrecta" });
  }

  res.json({ ok:true });
});

app.get("/productos/:correo", (req, res) => {
  let user = data.usuarios.find(u => u.correo === req.params.correo);
  res.json(user ? user.productos : []);
});

app.post("/productos/:correo", (req, res) => {
  let user = data.usuarios.find(u => u.correo === req.params.correo);
  if(user){
    user.productos.push(req.body);
    guardarData();
  }
  res.json(user.productos);
});

app.delete("/productos/:correo/:id", (req, res) => {
  let user = data.usuarios.find(u => u.correo === req.params.correo);
  if(user){
    user.productos.splice(req.params.id,1);
    guardarData();
  }
  res.json(user.productos);
});

app.listen(3000, () => {
  console.log("API corriendo en http://localhost:3000");
});