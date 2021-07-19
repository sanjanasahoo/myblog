const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const operationsOnDB = {
  findLatestPost: async function (id) {
    try {
      const latestPost = await prisma.post.findMany({
        where: {
          author : {
            id: parseInt(id)
          }
        },
        
        orderBy :{
          createdAt :'desc'
        },
        take :1,
      })
      return (latestPost[0])
    }
    catch (e) {
      throw e
    }
    finally {
      prisma.$disconnect()
    }
    
  },
  addFilename : async function (id,name){
    try {
      const post = await prisma.post.update({
        where :{
          id : id
        },
        data :{
          filename :name
        }
      })
      return post
    }
    catch(e)  {
      throw e
    }
  finally {
       prisma.$disconnect()
    }
    
  },
  
  findAllUsers : async function(){
    try {
      const allUsers = await prisma.user.findMany( 
        
    )
      return(allUsers)
    }
    catch(e)  {
        throw e
      }
    finally {
         prisma.$disconnect()
      }
  },
 
  findUserByEmail : async function (email){
    try { 
        const result = await prisma.user.findUnique({
          where: {
            email : email
          },
        })
        return(result)
  }
  catch(e)  {
      throw e
    }
  finally {
       prisma.$disconnect()
    }
  },
  findUserById : async function (id){
    try { 
        const result = await prisma.user.findUnique({
          where: {
            id : parseInt(id)
          },
        })
        return(result)
  }
  catch(e)  {
      throw e
    }
  finally {
       prisma.$disconnect()
    }
  },
 
  findAllPosts : async function (name,keyword,sortby) {
    let order  = sortby =='new'? 'desc':'asc'
    let posts
    try {
      if(name =='undefined'&& keyword == 'undefined'){
        posts = await prisma.post.findMany({
          orderBy :{
            createdAt :order
          },
          include:{
            author:true
          }

        })
      }
      else if(name =='undefined'|| keyword == 'undefined'){
        posts = await prisma.post.findMany({
          where: {
            OR :[
              {
                author: {
                  name :{
                   contains:name,
                   mode: "insensitive"
                  },
                 },
              },
              {
                content : {
                  contains : keyword,
                  mode: "insensitive"
                },
              }
            ]
            
          },
          orderBy :{
            createdAt :order
          },
          include:{
            author:true
          }
         
        })
      }
      else{
        posts = await prisma.post.findMany({
          where: {
            AND :[
              {
                author: {
                  name :{
                   contains:name
                  },
                 },
              },
              {
                content : {
                  contains : keyword
                },
              }
            ]
            
          },
          orderBy :{
            createdAt :order
          },
          include:{
            author:true
          }
         
        })
      }
      
      
      return(posts)
    }
    catch(e) {
      throw e
    }
  finally {
       prisma.$disconnect()
    }
  },
  createUser :  async function (user) {
      try {
    const createdUser =  await prisma.user.create({
        data :{
          name :user.name,
          email :user.email,
          password :user.password,
        },
      })
    }
    catch(err){
      return err.meta.target
    }
    finally {
      prisma.$disconnect()
   }
  },
  findPostbyId : async function (id){
    try { 
        const result = await prisma.post.findUnique({
          where: {
            id : parseInt(id)
          },
          include:{
            author:true
          }
        })
        return result
  }
  catch(e)  {
      throw e
    }
  finally {
       prisma.$disconnect()
    }
  },
  createPost : async function (id,title,content){
    try{
     const post = await prisma.user.update({
          where :{
              id : parseInt(id)
          },
          data: {
            
            posts: {
              create: { title: title ,content : content},
            }
            
          },
        })
        return post
  }
  catch(e)  {
    throw e
  }
  finally {
     prisma.$disconnect()
  }
  },
  updatePost : async function  (id,content,title){
    try{
       const post = await prisma.post.update({
            where :{
                id :parseInt(id)
            },
            data: {
              content : content,
              title : title
            },
          })
        return post
    }
    catch(e)  {
        throw e
      }
    finally {
         prisma.$disconnect()
      }
  },
  deletePost :async function  (id){
    try{
       const post = await prisma.post.delete({
            where :{
                id :parseInt(id)
            },
            
          })
        return post
    }
    catch(e)  {
        throw e
      }
    finally {
         prisma.$disconnect()
      }
  },
 
  
}
function checkUnAuthenticatedUser(req, res, next) {
  if (req.isAuthenticated()) next()
  else {
    res.redirect('/login')
  }
}



module.exports = {operationsOnDB,checkUnAuthenticatedUser}