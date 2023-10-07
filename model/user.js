const Mongoose = require('mongoose');

const UserSchema = new Mongoose.Schema({
    username:{
        type: String,
        required: true 
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate: {
            validator: function (v){
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
            },
            message: (props) => `${props.value} is not a valid email`
        },
    },
    password:{
        type: String,
        minlength: 6,
        required: true 
    },
    role:{
        type: String, 
        enum: ['admin', 'user'],
        default: 'user',
        required: true,
    },
    token: String,
})

const User = Mongoose.model('user',UserSchema);
module.exports = User;