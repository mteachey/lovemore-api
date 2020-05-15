const express = require('express')
const xss = require('xss')
//const path = require('path')
const SelfCaresService = require('./selfcares-service.js')

const selfcaresRouter = express.Router()
const jsonParser = express.json()

const serializedSelfCare = selfcare =>({
    id:selfcare.id,
    user_id:selfcare.user_id,
    content:xss(selfcare.content),
    type:selfcare.type,
    rating:selfcare.rating,
    date_modified:selfcare.date_modified
})

selfcaresRouter
    .route('/')
    .get((req, res, next)=>{
        SelfCaresService.getAllSelfCares(
            req.app.get('db')
        )
        .then(selfcares=>{
           
            res.json(selfcares.map(serializedSelfCare))
        })
        .catch(next)
    })
    .post(jsonParser, (req, res, next)=>{
        //providing user_id default
        const numberOfEntries = req.body.length;
        const validTypes = ['emotional', 'spiritual', 'physical','intellectual'];

        let newSelfCares = [];
        for(let i=0; i<numberOfEntries; i++){
            let { content, type, rating } = req.body[i]
            let newSelfCare = { content, type, rating }

            //checking for null
            for(const [key,value] of Object.entries(newSelfCare)){
                if(value==null){
                    return res.status(400).json({
                        error: { message : `Missing '${key}' in request body` }
                    })
                }
            }//end of for checking for null

            //checking for valid types and ratings
            if(type){
                if(!validTypes.includes(type)){
                    return res.status(400).json({
                        error: { message : `Type must be physical, intellectual, spiritual, emotional` }
                    })
                }
            }
            if(rating){
                if(rating<0 || rating > 11){
                    return res.status(400).json({
                        error: { message : `Rating must be between 1-10` }
                    })
                }
            }


            //add user_id, eventually will be part of req.body
            newSelfCare = {...req.body[i], user_id:2};
            newSelfCares = [...newSelfCares, newSelfCare]

        }//end for create newSelfCares array

        SelfCaresService.insertSelfCares(
            req.app.get('db'),
            newSelfCares
        )
        .then(selfcares=>{
            res
                .status(201)
                .json(selfcares.map(serializedSelfCare))
        })
        .catch(next)

    })

module.exports = selfcaresRouter
