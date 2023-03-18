const express = require('express')
const app = express()
const port = 3080

app.get("/", (req,res)=>{
    res.send("Welcome to car rental");
})

app.listen(port ,()=>{
   console.log(`Server is up on port ${port}`); 
});