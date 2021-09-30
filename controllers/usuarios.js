const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async(req, res)=>{

    // busca los usuarios y se filtra la informacion que se muestra
    const usuarios = await Usuario.find({}, 'nombre email role google');

    res.json({
        ok:true,
        usuarios
        // uid: req.uid
    })

}

const crearUsuario = async(req, res = response)=>{

    const { password, email} = req.body;


    try {

        // Buscamos si ya hay un email igual al que se esta enviando en el body
        const existeEmail = await Usuario.findOne({email});
        
        // Si existe, regresa un error 400 y muestra un mensaje
        if( existeEmail){
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }

        const usuario = new Usuario( req.body );

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        // Guarda el usuario
        // el await es para esperar a que termine una promesa antes de seguir con el codigo, debe estar dentro de una funcion async
        await usuario.save();

        // Generar el Token - JWT
        const token = await generarJWT(usuario.id);


        // solo se puede ejecutar una vez el res.json en el bloque de codigo
        res.json({
            ok:true,
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado ... revisar logs'
        });
    }
    

}

const actualizarUsuario = async(req, res = response) =>{

    // ToDo: Validar token y comprobar si es el usuario correcto

    const uid = req.params.id;
    // const { nombre, role, email } =req.body;

    try {

        // Se busca que exista un usuario con ese id
        const usuarioDB = await Usuario.findById(uid);

        if( !usuarioDB ){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }

        // Actualizaciones
        const {password, google, email, ...campos } = req.body;
        // Si el usuario tiene el mismo email, significa que no lo va a actualizar
        if( usuarioDB.email !== email){
            // de lo contrario, se busca en la BD que no exista otro email repetido,
            // si existe, manda error 400 y no permite actualizar
            const existeEmail = await Usuario.findOne({ email })
            if( existeEmail ){
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }

        // Se borran los datos que no quiero que se actualicen, en caso de que se manden
        // delete campos.password;
        // delete campos.google;
        
        // Si llega a esta parte, el email si se actualiza, entonces se regresa al objeto de campos
        campos.email = email;

        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, {new: true} );
        
        res.json({
            ok: true,
            usuario: usuarioActualizado
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado ... revisar logs'
        });
    }

}

const borrarUsuario = async(req, res = response) =>{
    
    // El nombre que se puso en los parametros de la ruta, es el que se pone aqui, en este caso "id"
    const uid = req.params.id;
    
    try {
        // Se busca que exista un usuario con ese id

        const usuarioDB = await Usuario.findById(uid);

        if( !usuarioDB ){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }

        // Nota: Normalmente no se borran registros, solo se actualiza el status (activo o inactivo)
        await Usuario.findByIdAndDelete( uid );
    
        res.status(200).json({
            ok: true,
            msg: 'Usuario eliminado'
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado ... revisar logs'
        });
    }
    

}

module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}