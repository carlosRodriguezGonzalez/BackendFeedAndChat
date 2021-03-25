/*
    path: api/login
*/
const { Router } = require("express");
const { check } = require("express-validator");

// Controladores
const { createUser, login, renewToken } = require("../controllers/auth");
const { validateFields } = require("../middlewares/validate-fields");
const { validateJWT } = require("../middlewares/validate-jwt");

const router = Router();

// Crear nuevos usuarios
router.post(
  "/new",
  [
    check("username", "El username es obligatorio").not().isEmpty(),
    check("password", "El password es obligatorio").not().isEmpty(),
    validateFields,
  ],
  createUser
);

// Login
router.post(
  "/",
  [
    check("username", "El username es obligatorio").not().isEmpty(),
    check("password", "El password es obligatorio").not().isEmpty(),
    validateFields,
  ],
  login
);

// Revalidar Token
router.get("/renew", validateJWT, renewToken);

module.exports = router;
