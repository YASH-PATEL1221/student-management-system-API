const mongoose = require("mongoose");
require('dotenv').config();
const process = require("process");

// AdminDB
mongoose.adminDB = mongoose.createConnection(process.env.DB_ADMIN,() => {
    console.log("connected to admin DB");
})

// login and logout timings
mongoose.loginandlogout = mongoose.createConnection(process.env.DB_LOGIN_AND_LOGOUT_TIMINGS,() => {
    console.log("connected to login and logout DB");
})

// studentDB
mongoose.studentDB = mongoose.createConnection(process.env.DB_STUDENT,() => {
    console.log("connected to student DB");
})
// courseDB
mongoose.courseDB = mongoose.createConnection(process.env.DB_COURSE,() => {
    console.log("connected to course DB");
})
// facultyDB
// gradeDB
// student DB

module.exports = mongoose;