const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/Car-Rental')
.then(()=>{
    console.log('Connected!!');
})
.catch((error)=>{
    console.log(error);
})