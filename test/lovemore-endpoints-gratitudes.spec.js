const knex = require('knex');
const app = require('../src/app')
require('dotenv').config()

const { makeUsersArray } = require('./users.fixtures.js')
const { makeGratitudesArray,
    makeMaliciousGratitude } = require('./gratitudes.fixtures.js')

describe(`LoveMore endpoints`,()=>{
    let db 

    before('make knex instance',()=>{
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
          })
          app.set('db', db)
        })

    after('disconnect from db',()=>db.destroy())

    before('clean the table', () => db.raw('TRUNCATE lovemore_gratitudes, lovemore_users RESTART IDENTITY CASCADE'))

    afterEach('cleanup',() => db.raw('TRUNCATE lovemore_gratitudes, lovemore_users RESTART IDENTITY CASCADE'))

    describe(`GET /`,()=>{
        context(`initial test of endpoint`,()=>{
            it(`responds with Hello, World`,()=>{
                return supertest(app)
                .get('/')
                .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .expect('Hello, world!')
            })
        })//end context GET/
    })//end describe GET/

    describe(`GET/api/gratitudes`,()=>{
        context(`Given no gratitudes`,()=>{
            it(`responds with 200 and an empty list`,()=>{
                return supertest(app)
                .get('/api/gratitudes')
                .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .expect(200,[])
            })
        })//end of context no gratitudes

        context('Given there are gratitudes in the database',()=>{
            const testUsers = makeUsersArray()
            const testGratitudes = makeGratitudesArray()

            beforeEach(`insert gratitudes`,()=>{
                return db
                .into('lovemore_users')
                .insert(testUsers)
                .then(()=>{
                    return db
                        .into('lovemore_gratitudes')
                        .insert(testGratitudes)
                })
            })//end beforeEach

            it(`responds with all gratitudes`,()=>{
                return supertest(app)
                .get('/api/gratitudes')
                .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .expect(200,testGratitudes)
            })//end it responds with all gratitudes
        })//end context gratitudes in db
    })//end of GET /gratitudes

    describe (`POST /api/gratitudes`,()=>{
        const testUsers = makeUsersArray();

        beforeEach(`insert users`,()=>{
            return db
            .into('lovemore_users')
            .insert(testUsers)
        })//end of beforeEach 

        it(`creates new gratitude entries with a 201 and the new entries with a default user_id`, function(){
            //this.retries(3)
            //will add in a user_id to newGratitudes
            const newGratitudes=[
                {
                    content:"test content",
                },
                {
                    content:"test content",
                }
            ]

            return supertest(app)
                .post('/api/gratitudes')
                .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .send(newGratitudes)
                .expect(res=>{
                    expect(res.body[0].content).to.eql(newGratitudes[0].content)
                    expect(res.body[1].content).to.eql(newGratitudes[1].content)
                    expect(res.body[0]).to.have.property('user_id')
                    expect(res.body[1]).to.have.property('user_id')
                    expect(res.body[0]).to.have.property('id')
                    expect(res.body[1]).to.have.property('id')
                })

        })//end of it creates new entries


        it(`responds with a 400 and an error message when 'content' is missing`,()=>{
            const newGratitude =[{}]

            return supertest(app)
                .post('/api/gratitudes')
                .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .send(newGratitude)
                .expect(400,{ error: {message : `Missing content in request body`}
                })

        })//end of it required field

    })//end of describe POST /gratitudes

})//end of LoveMore describe endpoints