const express = require('express')
const path = require('path')
const hbs = require('hbs')
const alert = require('alert')
const nodemailer = require("nodemailer");
const mailgen = require('mailgen')
const port = 3080
const app = express()
const data = require('./model/user')
const car_data = require('./model/car_details')
const checkout_data = require('./model/checkout_details')
const cookieParser = require('cookie-parser')
const {EMAIL , PASSWORD} = require('../src/env.js')

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
 
app.get("/login_page", (req,res)=>{
    res.render('login') 
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

app.get("/signup_page",(req,res)=>{
    res.render('signup')
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
             alert('Password Incorrect !!')
        }
    } else {
        alert('User not Registered !!')
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

app.get('/cars',(req,res)=>{
    res.render('cars')
})

// host user_data API
app.get('/fetch_userdata', async(req,res)=>{
    const userData = await data.find()
    res.send(userData)
})

// host car_data API 
app.get('/fetch_cardata', async (req,res)=>{
    const carData = await car_data.find()
    res.send(carData)
})

app.get('/fetch_checkout', async (req,res)=>{
    const checkOut = await checkout_data.find()
    res.send(checkOut)
})

// fetch car data and display it to a webpage. it will search on the basis of car name.
app.post('/search',async (req,res)=>{
    try {
    const carname = req.body.carname
    const getName = await car_data.findOne({carname:carname})
    const name = getName.carname
    console.log(name);
    console.log(carname);
    if(getName){
        res.render('checkAvail',{carname})
    } else {
        // res.send('<h1>Please Enter car name !!</h1>')
        // alert("Please Enter car name !! ")
        // alert('Required car not found !!')
        res.render('cars')
    }
    } catch (error) {
        res.send(error)
    }
})



//Enter data into car details db.
app.get('/car_form',(req,res)=>{
    res.render('car_form')
})

app.post('/car', (req,res)=>{
    const cardb = new car_data({
        carname: req.body.carname,
        car_type: req.body.car_type,
        year:req.body.year,
        no_of_seats: req.body.no_of_seats,
        price: req.body.price
    })
    const postData =  cardb.save(); 
})

app.get('/rent', async (req,res)=>{
    const cook = req.cookies.name
    res.render('checkout', {cook})
})

// send mail and store details in db

app.post('/mail' , async (req,res)=>{
    const userEmail = req.body.email;
    const duration = req.body.duration;
    const phone = req.body.phone;
    const carname = req.body.carname;

    const findPrice = await car_data.findOne({carname:carname})
    const getPrice = findPrice.price
    const getCar = findPrice.carname
    


    console.log(userEmail);
    console.log(carname);

    let config = {
        service: 'gmail',
        auth : {
            user: EMAIL,
            pass: PASSWORD
        }
    }

    let transporter = nodemailer.createTransport(config);

    let MailGenerator = new mailgen({
        theme: "default",
        product : {
            name: "Car Rental",
            link : 'https://mailgen.js/'
        }
    })

    let response = {
        body:{
            name:'User',
            table:{
                data: [
                    {
                        // First_Name: fname,
                        // Last_Name: lname,
                        Email: userEmail,
                        Phone_No: phone,
                        Car_Name: carname,
                        Duration: duration,
                    }
                ]
            }
        },
    }

    let mail = MailGenerator.generate(response)

    let message = {
        from : EMAIL,
        to : userEmail,
        subject: " Car Rented Successfully!",
        html: mail
    }

    transporter.sendMail(message).then(() => {
        // return res.status(201).json({
        //     msg: "you should receive an email"
        // })
        res.render('payment' , {getPrice , getCar} )
    }).catch(error => {
        return res.status(500).json({ error })
    })


    const checkdb = new checkout_data({
        email: req.body.email,
        phone: req.body.phone,
        carname: req.body.carname,
        duration: req.body.duration
    })
    const postData = await checkdb.save()

    
})


app.listen(port ,()=>{
   console.log(`Server is up on port ${port}`); 
});