//jshint esversion:6
require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')
const encrypt = require('mongoose-encryption')
const app = express()
mongoose.set('strictQuery', true);
app.use(express.static('public'))
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser: true})

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

userSchema.plugin(encrypt, {secret: process.env.SECRET , encryptedFields:["password"]})
const User = new mongoose.model("User",userSchema);
app.get('/',(req,res)=>{
    res.render('home');
});
app.get('/login', (req,res)=>{
    res.render('login');
});
app.get("/register", (req,res)=>{
res.render('register')
})
app.post("/register", (req,res)=>{
    const user = new User({
        email: req.body.username,
        password: req.body.password 
    })
    user.save(function(err){
        if(!err){
            res.render('home')
        }
        else{
            console.log(err)
        }
    });

});
app.post('/login',function(req,res){
    const email = req.body.username;
    const password = req.body.password;
    User.findOne({email: email}, function(err,founduser){
        if(err){
            console.log(err)
        }
        else{
            if(founduser.password === req.body.password){
                res.render('secrets');
            }
        }
    })
})

app.listen(3000, ()=>{
    console.log('server running on port 3000')
})