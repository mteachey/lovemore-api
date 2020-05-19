const express = require('express')
const xss = require('xss')
const MoodsService = require('./moods-service.js')

const moodsRouter = express.Router()
const jsonParser = express.json()

moodsRouter
    .route('/')
    .get((req, res, next)=>{
        MoodsService.getAllMoods(
            req.app.get('db')
        )
        .then(moods=>{
           
            res.json(moods)
        })
        .catch(next)
    })
    .post(jsonParser, (req, res, next)=>{
        //providing user_id default
           
            const { mood_level, energy_level } = req.body
            let newMood = { mood_level, energy_level } 

            //checking for null and valid number
            for(const [key,value] of Object.entries(newMood)){
                if(value==null){
                    return res.status(400).json({
                        error: { message : `Missing '${key}' in request body` }
                    })
                }
                if(value<0 || value > 11){
                    return res.status(400).json({
                        error: { message : `${key} must be between 1-10` }
                    })
                }
            }//end of for checking for null

            //add user_id
            newMood = {...newMood, user_id:2}

        MoodsService.insertMoods(
            req.app.get('db'),
            newMood
        )
        .then(moods=>{
            res
                .status(201)
                .json(moods)
        })
        .catch(next)

    })

module.exports = moodsRouter