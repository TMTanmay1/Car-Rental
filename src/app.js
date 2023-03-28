const express = require('express')
const path = require('path')
const hbs = require('hbs')
const port = 3080
const app = express()
const data = require('./model/user')
const cookieParser = require('cookie-parser')

const public_path = path.join(__dirname,'../public')
const viewsPath = path.join(__dirname,'../templates/views')

app.set('view engine','hbs')    
app.set('views',viewsPath)
require('./db/db')
app.use(express.urlencoded({extended: false}))
app.use(express.static(public_path))
app.use(cookieParser());


app.get("/",async (req,res)=>{
    const c_name = await req.cookies.name
    console.log(c_name);
    if(c_name){
        res.render("homepage",{c_name})
    } else {
        res.render("splash")
    }
})
 
app.get("/signup_page", (req,res)=>{
    res.render('signup') 
})

app.post('/signup_form', async (req,res)=>{
    try {
        const password = req.body.Password;
        const confirm_password = req.body.confirm_password;
        if(password === confirm_password){
            const userData = new data({
                Name: req.body.Name,
                Email: req.body.Email,
                Password: req.body.Password,
                confirm_password: req.body.confirm_password
            });
            const postData = await userData.save();  
            const c_name = req.body.Name
            res.cookie('name',c_name)
            // res.send(postData);

            res.render('login',{c_name})
        } else {
            res.send("password not matching!!")
        }
    } catch (error) {
        res.send(error);
    }
})

app.get("/login_page",(req,res)=>{
    res.render('login')
})

app.post('/login_form', async (req,res)=>{
    try {
        const email = req.body.email;
    const password = req.body.password;

    const getEmail = await data.findOne({Email: email})
    const c_name = getEmail.Name
    res.cookie('name',c_name) 

    if(getEmail){
        if(getEmail.Password == password){
            res.render('homepage',{c_name})
        } else {
             res.send('Password Incorrect !!')
        }
    } else {
        res.send('User not Registered !!')
    }
    } catch (error) {
        res.send(error)
    }
})

app.get('/home', (req,res)=>{
    res.render('homepage')
})


app.get('/catalogue', (req,res)=>{
    res.render('catalogue')
})


app.listen(port ,()=>{
   console.log(`Server is up on port ${port}`); 
});