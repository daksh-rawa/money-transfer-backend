const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://daksh:F5GKZw3PnDarsE6O@cluster0.i0yv5by.mongodb.net/")

const userSchema = new mongoose.Schema({

    username: String,
    //{
    //     type: String,
    //     required: true,
    //     unique: true,
    //     trim: true
    // },

    email:{
        type: String,
        required:true,
        unique:true
    },

    password:{
        type: String,
        required:true,
        minlength:6
    },

})

const account_Schema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    balance: {
        type: Number,
        default: 0,
        required: true
    }

})

const user = mongoose.model("User", userSchema)
const account=mongoose.model("Account", account_Schema)

module.exports = {
    user,
    account
}