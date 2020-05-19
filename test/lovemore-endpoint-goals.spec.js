const knex = require('knex');
const app = require('../src/app')
require('dotenv').config()
const { makeUsersArray } = require('./users.fixtures.js')
const { makeGoalsArray } = require('./goals.fixtures.js')

describe(`LoveMore endpoint /api/goals`,()=>{
    let db

    before('make knex instance',()=>{
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
          })
          app.set('db', db)
    })

    after(`disconnect from db`,()=>db.destroy())

    before('clean the table', () => db.raw('TRUNCATE lovemore_goals, lovemore_users RESTART IDENTITY CASCADE'))

    afterEach('cleanup',() => db.raw('TRUNCATE lovemore_goals, lovemore_users RESTART IDENTITY CASCADE'))

    describe(`GET /api/goals`,()=>{
        context(`Given no goals`,()=>{
            it(`responds with 200 and an empty list`,()=>{
                return supertest(app)
                .get('/api/goals')
                .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .expect(200,[])
            })
        })//end context no goals

        context(`Given goals in the db`,()=>{
            const testUsers = makeUsersArray()
            const testgoals = makeGoalsArray()

            beforeEach(`insert users and goals`,()=>{
                return db
                    .into('lovemore_users')
                    .insert(testUsers)
                    .then(()=>{
                        return db
                            .into('lovemore_goals')
                            .insert(testgoals)
                    })
            })//end beforeEach

            it(`responds with all goals`,()=>{
                return supertest(app)
                    .get('/api/goals')
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(200, testgoals)
            })//end it with goals in db
        })//end context goals in db       
    })//end describe GET

    describe (`POST /api/goals`,()=>{
        const testUsers = makeUsersArray();

        beforeEach(`insert users`,()=>{
            return db
            .into('lovemore_users')
            .insert(testUsers)
        })//end of beforeEach 

        it(`creates new goal entries with a 201 and the new entries with a default user_id`, function(){
            //this.retries(3)
            //will add in a user_id to newgoals
            const newgoal=
                {
                    emotional:1,
                    physical:3,
                    intellectual:5,
                    spiritual:6
                }

            return supertest(app)
                .post('/api/goals')
                .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .send(newgoal)
                .expect(res=>{
                expect(res.body.emotional).to.eql(newgoal.emotional)
                expect(res.body.physical).to.eql(newgoal.physical)
                expect(res.body.intellectual).to.eql(newgoal.intellectual)
                expect(res.body.spiritual).to.eql(newgoal.spiritual)
                expect(res.body).to.have.property('user_id')
                expect(res.body).to.have.property('id')
                })

        })//end of it creates new entries

        const validFields = ['emotional', 'physical','intellectual','spiritual']

        validFields.forEach(field=>{
            const newgoal = {
                    emotional:1,
                    physical:3,
                    emotional:5,
                    spiritual:6
            }

            it(`responds with a 400 and an error message when ${field} is missing`,()=>{
                newgoal[field] = 80

                return supertest(app)
                    .post('/api/goals')
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .send(newgoal)
                    .expect(400,{ error: {message : `${field} must be between 1-10`}
                    })

            })//end of it required field
        })//end of forEach

    })//end of describe POST /goals



})//end of describe /goal endpoint