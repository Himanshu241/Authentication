//jshint esversion:6
require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const app = express()
mongoose.set('strictQuery', true);
app.use(express.static('public'))
app.set('view engine','ejs')
const saltRounds = 10
app.use(bodyParser.urlencoded({extended:true}))

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser: true})

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})


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
bcrypt.hash(req.body.password,saltRounds,function(err,hash){
    const user = new User({
        email: req.body.username,
        password: hash
    })
    user.save(function(err){
        if(!err){
            res.render('home')
        }
        else{
            console.log(err)
        }
    });
})
});
app.post('/login',function(req,res){
    const email = req.body.username;
    const password = req.body.password;
    User.findOne({email: email}, function(err,founduser){
        if(err){
            console.log(err)
        }
        else{
            if(founduser){
            bcrypt.compare(password, hash, function(err, result){
                if(result === true)
                res.render('secrets');
            })
               
            }
        }
        
    })
})

app.listen(3000, ()=>{
    console.log('server running on port 3000')
})
