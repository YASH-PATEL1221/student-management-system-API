const express = require("express");
const StudentSchema = require("./StudentSchema");
const connections = require("../../connections");
const body_parser = require("body-parser");
const fs = require("fs");
const multer = require("multer");
const studentSchema = require("./StudentSchema");
const Router = express.Router();

Router.use(body_parser.json({limit:"1mb"}));
Router.use(express.urlencoded({extended:true}));
const storage = multer.diskStorage({
    destination:function(req,file,callback){
        const { SID } = req.body;
        if(!fs.existsSync(`./uploads/${SID}`)){
            fs.mkdirSync(`./uploads/${SID}`)
            callback(null,`./uploads/${SID}`);
        }else{
            callback(null,`./uploads/${SID}`);
        }
    },

    filename:function(req,file,callback){
        callback(null,file.originalname);
    }
})

const upload = multer({storage:storage});

const student = connections.studentDB.model("studentDB",studentSchema);

function ChangeNameOfFiles(){
    fs.readdir("./uploads",(err,result) => {
        let FolderName = []
        if(err) {
            console.log(err.message);
        }else{
            result.forEach(File => {
                FolderName.push(File)
            })
        }
        FolderName.forEach(Folder => {
            fs.readdir(`./uploads/${Folder}`,(err,FileNames) => {
                if(err){
                    console.log(err.message);
                }else{
                    fs.rename(`./uploads/${Folder}/${FileNames[0]}`,`./uploads/${Folder}/${Folder}.png`,(err) => {
                        if(err){
                            console.log(err.message);
                        }else{
                            return;
                        }
                    })
                }
            })
        })
    })
}
    


function RemoveUnnecessaryFolders(ArrayOfSID){
    ChangeNameOfFiles();
    fs.readdir("./uploads/",(error,result) => {
        if(error){
            console.log(error.message);
        }else{
            let res = result.filter(item => !ArrayOfSID.includes(item));
            if(res){
                res.forEach(file => {
                    fs.rmdirSync(`./uploads/${file}`,{ recursive: true, force: true })
                })
            }
        }
    })
}



Router.post("/addstudent",upload.array("studentImage",2),async (req,res) => {
    // ChangeNameOfFiles();
    const { SID } = req.body;
    
    try {
        fs.readdir(`./uploads/${ SID }`,async (err,result) => {
            if(err){
                console.log(err);
                res.status(500).send("Server error");
            }else{
                const ans = {...req.body,Images:`${result[0]}`};
                let AddStudent = new student(ans);
    
                await AddStudent.save();
                res.status(200).send("Data inserted");
            }
        })
    } catch (error) {
        console.log(error);
    }
})


Router.get("/getstudent",async (req,res) => {
    student.findOne({SID:req.query.q},'-_id -__v',(error,result) => {
        if(error){
            console.log(error);
            return res.status(500).send("Error to get data");
        }else{;
            return res.status(200).json(result);
        }
    })
});

Router.get("/getstudents",(req,res) => {

    student.find({},'-_id -__v',(error,result) => {
        if(error){
            console.log(error);
            return res.status(500).send("Error to get data");
        }else{
            let SIDs = result.map(result => result.SID);
            RemoveUnnecessaryFolders(SIDs);
            return res.status(200).json(result);
        }
    })
});

Router.put("/edit",(req,res) => {
    const body = req.body;
    console.log(body);
    student.findOneAndUpdate({SID:body.SID},body,{new:true, returnOriginal:true},(err,result) => {
        if(err){
            console.log(error);
            return res.status(500).send("Error to update data");
        }else{
            return res.status(201).send("Data Updated successfully");
        }
    })
});


Router.delete("/delete",(req,res) => {
    ChangeNameOfFiles();
    const { q } = req.query;
    student.deleteOne({SID:`${q}`},(err,result) => {
        if(err){
            console.log(err);
            return res.status(500).send("Error on deltetion");
        }else{
            return res.status(200).send("Data deleted successfully");
        }
    });
});


module.exports = Router;