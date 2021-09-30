const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');


const login = async(req, res = response) =>{

    const { email, password } = req.body;

    try {

        // Nota: es recomendable que al validar los datos, tenga un retardo de 1 o mas segundos para evitar "bombardear" el login
        
        // Verificar email
        const usuarioDB = await Usuario.findOne({email});

        // setTimeout(()=>{

        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado' //Normalmente no debe decir que dato esta incorrecto para no alertar al intruso cual dato esta bien
            });
        }

        // verificar contraseña
        const validPassword = bcrypt.compareSync( password, usuarioDB.password )
        if( !validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'Constraseña no válida'
            });
        }

        // Generar el Token - JWT
        const token = await generarJWT(usuarioDB.id);

        
        res.json({
            ok: true,
            token
        });

    // }, 5000);

    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });

    }
}

module.exports = {
    login
}