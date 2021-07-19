const {homeRoutesHandler} =require ('./homeRoutes')
const {postRoutesHandler} = require('./postRoutes')
const express = require("express");
function getRoutes(){
    const router = express.Router()
    router.use(express.urlencoded({extended:false}))
    router.use('/post',postRoutesHandler())
    router.use('/',homeRoutesHandler())
    
    return router

}

module.exports ={getRoutes}