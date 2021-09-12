require('dotenv').config();

const express = require('express');
const cors = require('cors');
// Desestructuramos la dbConnection
const { dbConnection } = require('./database/config');

// crear el servidor de express
const app = express();

// Configurar CORS
app.use(cors());

// Base de datos
dbConnection();

// mean_user
// Odu4NVFwFlzQNLUt
// Rutas
app.get( '/', (req, res)=>{

    res.json({
        ok:true,
        msj:'Hola mundo'
    })

} );


app.listen( process.env.PORT, ()=>{
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
});
