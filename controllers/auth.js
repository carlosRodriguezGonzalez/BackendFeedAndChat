const { response } = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/user");
const { generateJWT } = require("../helpers/jwt");

const createUser = async (req, res = response) => {
  try {
    const { username, password } = req.body;

    // verificar que el email no exista
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({
        ok: false,
        msg: "username already exists",
      });
    }

    const user = new User(req.body);

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    // Guardar usuario en BD
    await user.save();

    // Generar el JWT
    const token = await generateJWT(user.id);

    res.json({
      ok: true,
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

// login
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Verificar si existe el correo
    const userDB = await User.findOne({ username });
    if (!userDB) {
      return res.status(404).json({
        ok: false,
        msg: "Email no encontrado",
      });
    }

    // Validar el password
    const validPassword = bcrypt.compareSync(password, userDB.password);
    if (!validPassword) {
      return res.status(404).json({
        ok: false,
        msg: "Password no es correcto",
      });
    }

    // Generar el JWT
    const token = await generateJWT(userDB.id);

    res.json({
      ok: true,
      usuario: userDB,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

// renewToken
const renewToken = async (req, res) => {
  const uid = req.uid;

  // Generar un nuevo JWT
  const token = await generateJWT(uid);

  // Obtener el usuario por UID
  const usuario = await User.findById(uid);

  res.json({
    ok: true,
    usuario,
    token,
  });
};

module.exports = {
  createUser,
  login,
  renewToken,
};
