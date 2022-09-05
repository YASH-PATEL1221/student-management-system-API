const mongoose = require("mongoose");


let CourseSchema = mongoose.Schema({
    CourseID:String,
    CourseName:String
})

module.exports = CourseSchema;