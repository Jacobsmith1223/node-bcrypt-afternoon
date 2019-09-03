require('dotenv').config()
const express = require('express')
const cors = require('cors')
const massive = require('massive')
const session = require('express-session')

const authCTRL = require('./controllers/authController')
const tresCTRL = require('./controllers/treasureController')
const AUTH = require('./middleware/authMiddleware')


const{
CONNECTION_STRING,
SESSION_SECRET
}= process.env


const app = express()

app.use(express.json())
app.use(cors())
app.use(session({
    resave:true,
    saveUninitialized:false,
    secret: SESSION_SECRET,
    cookie:{
        maxAge:60000
    }
}))

massive(CONNECTION_STRING).then(dbInstance => {
    app.set('db', dbInstance)
    console.log('database connected BOIIIII')
}).catch(error => {
    console.log(error)
})



 const PORT = 4000

 app.post('/auth/register', authCTRL.register)
 app.post('/auth/login', authCTRL.login)
 app.get('/auth/logout', authCTRL.logout)

 app.get('/api/treasure/dragon'. tresCTRL.dragonTreasure)
 app.get('/api/treasure/user', AUTH.userOnly, tresCTRL.getUserTreasure)
 app.post('/api/treasure/user', AUTH.userOnly, tresCTRL.addUserTreasure)
 app.get('/api/treasure/all', AUTH.userOnly, tresCTRL.getAllTreasure)


 app.listen(PORT, () => console.log('we up'))