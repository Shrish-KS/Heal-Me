const express = require('express')
const mongoose = require('mongoose')
const helmet = require('helmet')
const morgan = require('morgan')
const dotenv = require('dotenv')
const userRouter = require('./routers/users.js')
const authRouter = require('./routers/auth.js')
const postRouter = require('./routers/post.js')

dotenv.config()

const app = express()

mongoose.connect("mongodb://0.0.0.0:27017/media-data").then((client)=>{
  console.log("database is created")
})

app.use(express.json())
app.use(express.urlencoded({extended : false}))
app.use(helmet())
app.use(morgan('common'))
app.use('/api/users',userRouter)
app.use('/api/auth',authRouter)
app.use('/api/post',postRouter)


app.get('/',(req,res) => {
  res.send("Welcome to home page")
})

app.get('/users',(req,res) => {
  res.send("Welcome to users page")
})


app.listen(5000)