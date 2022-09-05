const express = require("express");
const app = express();
const Routes = [require("./Routes/Admin/admin")];
const process = require("process");
// const methodOverride = require("method-override");
require("dotenv").config();
const PORT = 3000 || process.env.LISTNING_PORT;

// app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.use(express.json({limit:"1mb"}));


app.get("/",(req,res) => {
    console.log("somthing happen");
    res.send("home");
})
app.use("/admin",Routes[0]);

app.use("*",(req,res) => {
    res.status(404).send("404 Not found");
})

app.listen(PORT,() => {
    console.log(`server is listning on port http://localhost:${PORT}`);
})