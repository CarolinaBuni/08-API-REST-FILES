const { isAuth } = require( "../../middlewares/auth" );
const upload = require( "../../middlewares/file" );
const { getUsuarios, register, login, putUsuarios } = require( "../controllers/usuario" );

const usuariosRoutes = require("express").Router();

usuariosRoutes.get("/",[isAuth], getUsuarios);
usuariosRoutes.post("/register", upload.single("img"), register);
usuariosRoutes.post("/login", login);
usuariosRoutes.put("/:id", [isAuth], putUsuarios);

module.exports = usuariosRoutes;



