const express = require("express");
const router = express.Router();



router.get("/",(req,res)=>{
    res.send("You are in the main page");
})

router.get("/new",(req,res)=>{
    res.send("You are in the main page");
})

router.get("/edit",(req,res)=>{
    res.send("You are in the main page");
})

router.get("/delete",(req,res)=>{
    res.send("You are in the main page");
})

module.exports = router;