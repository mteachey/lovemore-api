require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const logger = require('./logger')
const { NODE_ENV } = require('./config')
const selfcaresRouter = require('./selfcares/selfcares-router.js')
const gratitudesRouter = require('./gratitudes/gratitudes-router.js')
const quotesRouter = require('./quotes/quotes-router.js')
const inspiresRouter = require('./inspires/inspires-router.js')
const moodsRouter = require('./moods/moods-router.js')
const goalsRouter = require('./goals/goals-router.js')


const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

//validate API_Token
/*app.use(function validateBearerToken(req, res, next){
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')

    if(!authToken || authToken.split(' ')[1] !== apiToken){
       logger.error(`Unauthorized request to path: ${req.path}`);
        return res.status(401).json({ error: 'Unauthorized request'})
    }
    next()
})*/

app.use('/api/selfcares',selfcaresRouter)
app.use('/api/gratitudes',gratitudesRouter)
app.use('/api/quotes', quotesRouter)
app.use('/api/moods',moodsRouter)
app.use('/api/goals',goalsRouter)
app.use('/api/inspires',inspiresRouter)

app.get('/',(req,res)=>{
    res.send('Hello, world!')
})

app.use(function errorHandler(error, req, res, next){
    let response
    if(NODE_ENV === 'production'){
        response = {error :{message:'server error'}}
    }
    else{
        console.error(error)
        response = { message: error.message, error}
    }
    res.status(500).json(response)
})

module.exports = app