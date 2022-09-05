const express = require("express");
const Router = express.Router();
const Routes = [require("../Student/Student"),require("../Courses/courses")]
const connections = require("../../connections");
const AdminSchema = require("./adminSchema");
const session = require("express-session");
const bcryptjs = require("bcryptjs");
const hash = require("../hash");
const process = require("process");
const LoignAndLoguoutTimeSchema = require("../loignlogoutSchema");
const GetApiKey = require("../../apikey");
const cookie_parser = require("cookie-parser");
const mongoDBSessions = require("connect-mongodb-session")(session);
require("dotenv").config();

const store = new mongoDBSessions({
    uri:process.env.DB_ADMIN,
    collection:"myAdminSession"
});

let id = "";

Router.use(cookie_parser());

Router.use((req,res,next) => {
    id = req.body.AID;

    // console.log(req.body,"line 22");
    // console.log(id,"line 25");
    next();
},
    session({
    secret: process.env.SESSION_SECRET + id,
    resave:true,
    saveUninitialized:false,
    store:store
}))

const admin = connections.adminDB.model("adminDB",AdminSchema);
const loginAndLogout = connections.loginandlogout.model("loginandlogoutimeDB",LoignAndLoguoutTimeSchema);

function storeLoginAndLogoutTimings(data,LoginOrLogout){
    admin.find({AID:data},async (err,result) => {
        const GetCurrentDateAndTime = new Date();

        if(err){
            console.log(err.message);
        }else{
            const AddData = new loginAndLogout({
                AID:result[0].AID,
                Name:result[0].AdminName,
                type:LoginOrLogout,
                Time:GetCurrentDateAndTime.toLocaleDateString() + " " + GetCurrentDateAndTime.toLocaleTimeString()
            })

            await AddData.save();
        }
    })
}

Router.use(express.urlencoded({extended:true}));

function isAuth(req,res,next){
    // console.log(req.session,"line 69");
    if(req.session.AuthorizedUser){
        next();
    }else{
        res.send("not logged in");
    }
}

Router.use("/course",isAuth,Routes[1]);

Router.use("/student",isAuth,Routes[0]);

Router.get("/",(req,res,next) => {
    console.log(req.headers);
    res.send("admin");
})

Router.post("/", async (req,res) => {
    let {AID,Password} = req.body;
    console.log(req.body);

    // Password = hash(Password + process.env.SALT);

    // let addAdmin = new admin({
    //     AID:AID,
    //     AdminName:AdminName,
    //     Password:Password,
    //     Key:GetApiKey()
    // })

    // await addAdmin.save();
    // console.log("data saved");
    // res.send(addAdmin);
    // res.end();

    try{
        admin.find({AID:`${AID}`},(err,result) => {
            console.log(AID);
            let key = req.headers['x-api-key'];
            try {
                // console.log(result);
                if(!result[0] || result[0].Key != key){
                    res.status(401).json({
                        status:"Unauthorized User"
                    });
                }else{
                    const ComparePassword = bcryptjs.compareSync(Password + process.env.SALT,result[0].Password);
                    if(ComparePassword){
                        console.log(req.session,"line 110");
                        req.session.AuthorizedUser = true;
                        req.session.AID = AID;
                        storeLoginAndLogoutTimings(AID,"Login");
                        res.status(200).json({
                            status:true,
                        });
    
                    }else{
                        res.status(401).json({
                            status:"wrong password"
                        })
                    }
                }
            } catch (error) {
                console.log(error);
                res.status(500).send("server side problem");
            }
        })
    }
    catch(e){
        console.log(e);
    }
})

Router.get("/dashboard",isAuth,(req,res) => {
    res.send("This is dahboard");
})


Router.post("/logout",isAuth,(req,res) =>{
    console.log(req.session.AID,"line 141");
    storeLoginAndLogoutTimings(req.session.AID,"Logout");
    req.session.destroy(err =>{
        if(err) throw err;
    })
    res.send("logout");
})

module.exports = Router;