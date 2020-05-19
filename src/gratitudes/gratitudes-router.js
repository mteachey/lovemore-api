const express = require('express')
const xss = require('xss')
//const path = require('path')
const GratitudesService = require('./gratitudes-service.js')

const gratitudesRouter = express.Router()
const jsonParser = express.json()

const serializedGratitude = gratitude =>({
    id:gratitude.id,
    user_id:gratitude.user_id,
    content:xss(gratitude.content),
    date_modified:gratitude.date_modified,
})

gratitudesRouter
    .route('/')
    .get((req, res, next)=>{

            console.log(`did this run`);
            GratitudesService.getAllGratitudes(
                req.app.get('db')
            )
            .then(gratitudes=>{

                res.json(gratitudes.map(serializedGratitude))
            })
            .catch(next)
    })

    .post(jsonParser, (req, res, next)=>{

        const numberOfEntries = req.body.length
        let newGratitudes = [];
        for(let i=0; i<numberOfEntries; i++){         
            if(req.body[i].content==null){
                return res.status(400).json({
                    error: { message : `Missing content in request body`}
                })
            }

            //add in the user_id
            //eventually user_id will be part of req.body
            let newGratitude = {...req.body[i],user_id:2};

            newGratitudes = [...newGratitudes, newGratitude]
        }
        
       GratitudesService.insertGratitudes(
            req.app.get('db'),
            newGratitudes
        )
        .then(gratitudes=>{
            res
                .status(201)
                .json(gratitudes.map(serializedGratitude))
        })
        .catch(next)
    })

module.exports = gratitudesRouter
