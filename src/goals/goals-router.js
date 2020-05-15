const express = require('express')
const xss = require('xss')
//const path = require('path')
const GoalsService = require('./goals-service.js')

const goalsRouter = express.Router()
const jsonParser = express.json()

goalsRouter
    .route('/')
    .get((req, res, next)=>{
        GoalsService.getAllGoals(
            req.app.get('db')
        )
        .then(goals=>{
           
            res.json(goals)
        })
        .catch(next)
    })
    .post(jsonParser, (req, res, next)=>{
        //providing user_id default
           
            const { emotional=0, physical=0, intellectual=0, spiritual=0 } = req.body
            let newgoal = { emotional, physical, intellectual, spiritual }  
            console.log(newgoal)
            //checking for null and valid number
            for(const [key,value] of Object.entries(newgoal)){
        
                if(value<-1 || value > 11){
                    return res.status(400).json({
                        error: { message : `${key} must be between 1-10` }
                    })
                }
            }//end of for checking for null

            //add user_id
            newgoal = {...newgoal, user_id:2}

        GoalsService.insertGoals(
            req.app.get('db'),
            newgoal
        )
        .then(goals=>{
            res
                .status(201)
                .json(goals)
        })
        .catch(next)

    })

module.exports = goalsRouter
