if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const logger = require('./logger')
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000
const path = require('path')
const { getRoutes } = require('./routes/index')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const {initializePassport} = require('./passport-config')
const flush = require('connect-flash')
const upload = require('express-fileupload')
initializePassport(passport)
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'../src', 'views'))
app.use(express.static(path.join(__dirname,'public')))
app.use(upload())
app.use(session({
    secret : process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized :false
}))
app.use(flash())
app.use(flush())
app.use(passport.initialize())
app.use(passport.session())
function errorHandler(err,req,res,next){
    if(err){
        logger.log("error",`${err}`)
        res.send('<h1>There is an error,please try again!</h1>')
    }
}

function startServer(){
    app.use('/',getRoutes())
    app.use(errorHandler)
    
    app.listen(PORT,()=>{
        logger.log("info",`Listening to port ${PORT}`)
    })
}
module.exports = {startServer}