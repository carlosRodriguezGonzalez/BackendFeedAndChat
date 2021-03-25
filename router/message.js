/*
    Path: api/mensajes
*/

const { Router } = require("express");
const { getChat } = require("../controllers/message");
const { validateJWT } = require("../middlewares/validate-jwt");

const router = Router();

router.get("/:otherId", validateJWT, getChat);

module.exports = router;
