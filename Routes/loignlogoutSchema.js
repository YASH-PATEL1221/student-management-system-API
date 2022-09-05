const mongoose = require("mongoose");

const LoignAndLoguoutTimeSchema = mongoose.Schema({
    AID:String,
    Name:String,
    type:{
        type:String,
        enum:["Login","Logout"]
    },
    Time: String
})

module.exports = LoignAndLoguoutTimeSchema;