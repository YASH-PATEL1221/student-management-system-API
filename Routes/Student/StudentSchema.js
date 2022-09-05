const mongoose = require("mongoose");
const process = require("process");
require("dotenv").config();


const studentSchema = mongoose.Schema({
    SID:String,
    Gender:{
        type:String,
        enum:["M","F"]
    },
    StudentName:String,
    Address:String,
    DOB:String,
    Pincode:{
        type:String,
        
    },
    CourseID:String,
    Images:String,

});
studentSchema.path("Pincode").validate(function(v){
    return v.length == 6;
})


module.exports = studentSchema;