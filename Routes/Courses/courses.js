const express = require("express");
const connections = require("../../connections");
const CourseSchema = require("./CoursesSchema");
const Router = express.Router();

const course = connections.courseDB.model("courseDB",CourseSchema)

Router.get("/",(req,res) => {
    res.send("course route");
});

Router.post("/",async (req,res) => {
    let SaveCourse = new course({
        CourseID: req.body.CID,
        CourseName:req.body.CourseName
    });
    await SaveCourse.save();
    res.status(200).send("Data saved");
});

Router.get("/getcourses",(req,res) => {
    let { CID } = req.body;

    course.find({},'-_id -__v',(err,result) => {
        res.send(result);
    })
});

Router.get("/getcourse",(req,res) => {
    let CID = req.query.q;
    console.log(CID);

    course.find({CourseID:`${CID}`},(err,result) => {
        console.log(result);
        res.send(result);
    })
});

Router.put("/edit",(req,res) => {
    const body = req.body;
    course.findOneAndUpdate({CourseID:body.CID},body,{new:true,returnOriginal:true},(err,result) => {
        if(err){
            console.log(error);
            return res.status(500).send("Error to update data");
        }else{
            return res.status(201).send("Data Updated successfully");
        }
    })
});

Router.delete("/delete",(req,res) => {
    const { q } = req.query;
    course.deleteOne({CourseID:`${q}`},(err,result) => {
        if(err){
            console.log(err);
            return res.status(500).send("Error on delete");
        }else{
            return res.status(200).send("Data deleted successfully");
        }
    });
});

module.exports = Router;