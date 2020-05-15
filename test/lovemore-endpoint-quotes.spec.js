const knex = require('knex');
const app = require('../src/app')
const { makeUsersArray } = require('./users.fixtures.js')
const { makeQuotesArray } = require('./quotes.fixtures.js')

describe(`LoveMore endpoint /api/quotes`,()=>{
    let db

    before('make knex instance',()=>{
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
          })
          app.set('db', db)
    })

    after(`disconnect from db`,()=>db.destroy())

    before('clean the table', () => db.raw('TRUNCATE lovemore_quotes, lovemore_users RESTART IDENTITY CASCADE'))

    afterEach('cleanup',() => db.raw('TRUNCATE lovemore_quotes, lovemore_users RESTART IDENTITY CASCADE'))

    describe(`GET /api/quotes`,()=>{
        context(`Given no quotes`,()=>{
            it(`responds with 200 and an empty list`,()=>{
                return supertest(app)
                .get('/api/quotes')
                .expect(200,[])
            })
        })//end context no quotes

        context(`Given quotes in the db`,()=>{
            const testUsers = makeUsersArray()
            const testquotes = makeQuotesArray()

            beforeEach(`insert users and quotes`,()=>{
                return db
                    .into('lovemore_users')
                    .insert(testUsers)
                    .then(()=>{
                        return db
                            .into('lovemore_quotes')
                            .insert(testquotes)
                    })
            })//end beforeEach

            it(`responds with all quotes`,()=>{
                return supertest(app)
                    .get('/api/quotes')
                    .expect(200, testquotes)
            })//end it with quotes in db
        })//end context quotes in db       
    })//end describe GET

})//end of describe endpoint /quotes