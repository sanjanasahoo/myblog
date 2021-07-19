const express = require('express')
const passport = require('passport')
const {operationsOnDB,checkUnAuthenticatedUser} = require('../utils')
const md = require('markdown-it')()
const methodOverride = require('method-override')

async function deletingPost(req,res,next){
  const post = await operationsOnDB.deletePost (req.params.id)
  next()
}

function convertPostContentToMarkdown(post){
 const markedDownContent = md.render(String(post.content))
 post.content = markedDownContent
 return post
}
  function postRoutesHandler(){
    const router = express.Router()
    router.use(express.urlencoded({extended:false}))
    router.use(methodOverride('_method'));
    router.get('/:id',async(req,res)=>{
        let post = await operationsOnDB.findPostbyId(req.params.id)
        post = convertPostContentToMarkdown(post)
        let user = req.user?req.user:null
        res.render('details',{post,user:user})
    })
    router.get('/update/:id',checkUnAuthenticatedUser,async(req,res)=>{
      const post = await operationsOnDB.findPostbyId(req.params.id)
      res.render('updatepost',{data:post})
    })
    router.put('/:id',async(req,res)=>{
      const id = parseInt(req.params.id)
      const content = req.body.content
      const updatedPost = await operationsOnDB.updatePost(id,content,req.body.title)
      if(updatedPost) {
        res.redirect(`/post/${id}`)
      }
      else{
        res.send("could not update")
      }
    })
    router.delete('/:id',checkUnAuthenticatedUser,deletingPost,async(req,res)=>{
        req.flash('message','Deleted Successfully')
        res.redirect('/')
      })
    router.get('/login',async(req,res)=>{
        res.redirect('/')
    })
    return router
  }
module.exports ={postRoutesHandler}