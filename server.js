const express=require('express')
const colors=require('colors')                      // to show the colors in the console

//Morgan: Morgan is an HTTP request level Middleware. It is a great tool that logs the requests along with some other information depending upon its configuration and the preset used. It proves to be very helpful while debugging and also if you want to create Log files.
const morgan=require('morgan')
const dotenv=require('dotenv')                   // for environment file deployment
const connectDB = require('./config/db')


const app=express()

/****************************************To read and parse the json Data when the request is in the form of json************************** */
app.use(express.json({}))
app.use(express.json({
    extended:true
}))
app.use(express.urlencoded())                 /********************************This is use when we submit data through the form */
/******************************************************************************************************* */

app.use(morgan('dev'))               //showing the details of the request in the console

dotenv.config({
    path:'./config/config.env'
})

connectDB()                            // to connect from the database
app.use('/api/todo/auth',require('./routes/user'))


const PORT=process.env.PORT || 3000                              // We can access the environment file like this 
//agar server ka port nhi mila toh 3000 pe run hoga

app.listen(PORT,console.log(`Server running on port  ${PORT}`.yellow.underline.bold))
