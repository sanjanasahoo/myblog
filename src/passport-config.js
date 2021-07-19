const LocalStatergy = require('passport-local').Strategy
const {operationsOnDB} = require('./utils')
function initializePassport(passport){
    const authenticateUser = async(email,password,done)=>{
        const user = await operationsOnDB.findUserByEmail(email)
        if(!user){
        return done(null,false,{message:'No user with that E-mail'})
        }
        try{
            if(password===user.password){
                return done(null,user)
            }
            else{
                return done(null,false,{message:"Password Incorrect"})
            }
        }
        catch(e) {
            return done(e)
        }
    }
    passport.use(new LocalStatergy({usernameField:'email'},authenticateUser))
    passport.serializeUser((user,done)=>{ done(null, user.id); })
    passport.deserializeUser((userId,done)=>{ 
        operationsOnDB.findUserById(userId)
        .then((user) => {
            done(null, user);
        })
        .catch(err => done(err))
     })

}
module.exports = {initializePassport}