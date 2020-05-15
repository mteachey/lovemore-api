const express = require('express')
//const xss = require('xss')
//const path = require('path')
const QuotesService = require('./quotes-service.js')

const quotesRouter = express.Router()


quotesRouter
    .route('/')
    .get((req, res, next)=>{
        QuotesService.getAllQuotes(
            req.app.get('db')
        )
        .then(quotes=>{
           
            res.json(quotes)
        })
        .catch(next)
    })

module.exports = quotesRouter