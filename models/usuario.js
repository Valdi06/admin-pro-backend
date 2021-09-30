const { Schema, model } = require('mongoose');


const UsuarioSchema = Schema({

    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE'
    },
    google: {
        type: Boolean,
        default: false
    },

});

// para cambiar como se muestra el id, no afecta la bd
UsuarioSchema.method('toJSON', function(){
    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
})

// (nombre, schema que utiliza)
module.exports = model('Usuario', UsuarioSchema);