const express = require("express");
const usuariosRoutes = require( "./usuario" );
const eventsRoutes = require( "./evento" );
const commentsRoutes = require( "./comentario" );

const router = express.Router();

router.use("/usuarios", usuariosRoutes);
router.use("/eventos", eventsRoutes);
router.use("/comentarios", commentsRoutes);



module.exports = router;
