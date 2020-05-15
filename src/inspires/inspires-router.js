const express = require('express')
const xss = require('xss')
//const path = require('path')
const InspiresService = require('./inspires-service.js')

const inspiresRouter = express.Router()

const serializedInspire = inspire =>({
    id:inspire.id,
    type:inspire.type,
    content:xss(inspire.content)
})

inspiresRouter
    .route('/')
    .get((req, res, next)=>{
        InspiresService.getAllInspires(
            req.app.get('db')
        )
        .then(inspires=>{
           
            res.json(inspires.map(serializedInspire))
        })
        .catch(next)
    })

module.exports = inspiresRouter