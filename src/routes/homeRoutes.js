const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const express = require('express')
const passport = require('passport')
const { operationsOnDB ,checkUnAuthenticatedUser} = require('../utils')
const { body, validationResult, check } = require('express-validator');
const path = require('path')




function authenticateFields(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('register', { errors: (errors.array()) });
  }
  next()
}
async function getPosts(req, res, next) {
  let author = req.query.authorFilter ? req.query.authorFilter : 'undefined'
  let keyword = req.query.keywordSearch ? req.query.keywordSearch : 'undefined'
  let sort = req.query.sort ? req.query.sort : 'new'
  const userPosts = await operationsOnDB.findAllPosts(String(author), keyword, sort)
  req.post = userPosts
  req.author = author ? author : null
  req.keyword = keyword ? keyword : null
  req.sort = sort
  next()
}
function homeRoutesHandler() {
  const router = express.Router()
  router.use(express.urlencoded({ extended: false }))
  router.get('/', getPosts, async (req, res) => {
    let user = req.user ? req.user : null;
    const posts = req.post 
    const users = await operationsOnDB.findAllUsers()
    const authors = users.map(user => user.name)
    req.authors = authors
    const author = req.author
    const keyword = req.keyword
    const sortby = req.sort
    res.render('home', { posts, user, authors, author: author, keyword: keyword, sortby: sortby, message: req.flash('message') })
  })

  router.get('/login', (req, res) => {
    res.render('login')
  })
  router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }))

  router.get('/register', (req, res) => {
    res.render('register')
  })
  router.post('/register', body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    check('email').custom(value => {
      return operationsOnDB.findUserByEmail(value).then(user => {
        if (user) {
          return Promise.reject('E-mail already in use');
        }
      });
    }),
    authenticateFields, async (req, res) => {
      try {
        await operationsOnDB.createUser({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        })
        res.render('register', { message: "Registered Successfully" })
      }
      catch {
        res.redirect('/register')
      }

    })



  router.get('/add/:id', checkUnAuthenticatedUser, async (req, res) => {
    res.render('addpost')
  })
  router.post('/add/:id', async (req, res) => {
    const id = req.params.id
    const title = req.body.title
    const content = req.body.content
    const createdPost = await operationsOnDB.createPost(id, title, content)
    if (createdPost) {
      const latestPost = await operationsOnDB.findLatestPost(id)
      if (req.files) {
        const file = req.files.file
        file.mv(path.join(__dirname,'../public/uploads', `${id}-${latestPost.id}.png`)
        , (err) => {
            if (err) res.send(err)
          })
        await operationsOnDB.addFilename(latestPost.id, id + '-' + latestPost.id + '.png')
      }

      res.redirect('/')
    }
    else {
      res.send("could not create")
    }
  })
  router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
  })
  return router

}

module.exports = { homeRoutesHandler }