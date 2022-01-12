require("dotenv").config();
require("./config/database").connect();

const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');

app.use(express.json());

const User = require('./model/user');
const res = require("express/lib/response");

app.get('/', (req, res)=>{

    res.send("<h1>Hello from Auth system</h1>");

});

app.post("/register", async(req, res)=>{

    try {
        const {firstName, lastName, email, password} = req.body;
    
    if(!(email && password && lastName && firstName)){
        res.status(400).send('All fields are required');
    }

    const existingUser = await User.findOne({email}); //promise
    
    if(existingUser){
        res.status(401).send("User already exists");
    }
    const myEncPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        firstName,
        lastName,
        email: email.toLowerCase(),
        password: myEncPassword
    });

    //token
    const token = jwt.sign(
        {user_id : user._id, email},
        process.env.SECRET_KEY,
        {
            expiresIn: "2h"
        }
    )
    user.token = token;

    //update or not in DB
    //TODO: handle the password situation
    user.password = undefined;

    res.status(201).json(user);
        
    } catch (error) {
        console.log(error);
    }

});

app.post('/login', async (req, res)=>{
    try {
        const {email, password} = req.body;
        if(!(email && password)){
            res.status(401).send('<h1> Field is missing</h1>');
        }

        const user = await User.findOne({email});

        if(!user){
            res.status(401).send('<h1> You are not registered in the app...</h1>');

        }

        if(user && (await bcrypt.compare(password, user.password))){
            const token = jwt.sign(
                {user_id: user._id, email},
                process.env.SECRET_KEY,
                {
                    expiresIn: "2h"
                }
            )
            user.token = token;
            user.password = password;
            res.status(200).json(user);
        }

        res.status(400).send("Email or password is incorrect");

    } catch (error) {
        
    }
});

app.get('/dashboard',auth, (req, res)=>{
    console.log(req.user);
    res.send('<h1>Welcome to the secret page</h1>')
});

module.exports = app;
