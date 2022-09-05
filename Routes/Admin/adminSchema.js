const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
    AID:Number,
    AdminName:String,
    Password:String,
    Key:String
})

module.exports = adminSchema;