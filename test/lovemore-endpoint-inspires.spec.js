const knex = require('knex');
const app = require('../src/app')
require('dotenv').config()
const { makeUsersArray } = require('./users.fixtures.js')
const { makeInspiresArray } = require('./inspires.fixtures.js')

describe(`LoveMore endpoint /api/inspires`,()=>{
    let db

    before('make knex instance',()=>{
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
          })
          app.set('db', db)
    })

    after(`disconnect from db`,()=>db.destroy())

    before('clean the table', () => db.raw('TRUNCATE lovemore_inspires, lovemore_users RESTART IDENTITY CASCADE'))

    afterEach('cleanup',() => db.raw('TRUNCATE lovemore_inspires, lovemore_users RESTART IDENTITY CASCADE'))

    describe(`GET /api/inspires`,()=>{
        context(`Given no inspires`,()=>{
            it(`responds with 200 and an empty list`,()=>{
                return supertest(app)
                .get('/api/inspires')
                .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .expect(200,[])
            })
        })//end context no inspires

        context(`Given inspires in the db`,()=>{
            const testUsers = makeUsersArray()
            const testinspires = makeInspiresArray()

            beforeEach(`insert users and inspires`,()=>{
                return db
                    .into('lovemore_users')
                    .insert(testUsers)
                    .then(()=>{
                        return db
                            .into('lovemore_inspires')
                            .insert(testinspires)
                    })
            })//end beforeEach

            it(`responds with all inspires`,()=>{
                return supertest(app)
                    .get('/api/inspires')
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(200, testinspires)
            })//end it with inspires in db
        })//end context inspires in db       
    })//end describe GET
})//end of describe /inspires endpoint