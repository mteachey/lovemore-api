const knex = require('knex');
const app = require('../src/app')
const { makeUsersArray } = require('./users.fixtures.js')
const { makeSelfCaresArray, makeMaliciousSelfCare } = require('./selfcares.fixtures.js')
require('dotenv').config()

describe(`LoveMore endpoint /api/selfcares`,()=>{
    let db

    before('make knex instance',()=>{
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
          })
          app.set('db', db)
    })

    after(`disconnect from db`,()=>db.destroy())

    before('clean the table', () => db.raw('TRUNCATE lovemore_selfcares, lovemore_users RESTART IDENTITY CASCADE'))

    afterEach('cleanup',() => db.raw('TRUNCATE lovemore_selfcares, lovemore_users RESTART IDENTITY CASCADE'))

    describe(`GET /api/selfcares`,()=>{
        context(`Given no selfcares`,()=>{
            it(`responds with 200 and an empty list`,()=>{
                return supertest(app)
                .get('/api/selfcares')
                .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .expect(200,[])
            })
        })//end context no selfcares

        context(`Given selfcares in the db`,()=>{
            const testUsers = makeUsersArray()
            const testSelfCares = makeSelfCaresArray()

            beforeEach(`insert users and selfcares`,()=>{
                return db
                    .into('lovemore_users')
                    .insert(testUsers)
                    .then(()=>{
                        return db
                            .into('lovemore_selfcares')
                            .insert(testSelfCares)
                    })
            })//end beforeEach

            it(`responds with all selfcares`,()=>{
                return supertest(app)
                    .get('/api/selfcares')
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(200, testSelfCares)
            })//end it with selfcares in db
        })//end context selfcares in db       
    })//end describe GET

    describe (`POST /api/selfcares`,()=>{
        const testUsers = makeUsersArray();

        beforeEach(`insert users`,()=>{
            return db
            .into('lovemore_users')
            .insert(testUsers)
        })//end of beforeEach 

        it(`creates new selfcare entries with a 201 and the new entries with a default user_id`, function(){
            //this.retries(3)
            //will add in a user_id to newSelfCares
            const newSelfCares=[
                {
                    content:"test content",
                    type:"emotional",
                    rating:2
                },
                {
                    content:"test content",
                    type:"physical",
                    rating:5
                }
            ]

            return supertest(app)
                .post('/api/selfcares')
                .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .send(newSelfCares)
                .expect(res=>{
                   expect(res.body[0].content).to.eql(newSelfCares[0].content)
                   expect(res.body[1].content).to.eql(newSelfCares[1].content)
                   expect(res.body[0].type).to.eql(newSelfCares[0].type)
                   expect(res.body[1].type).to.eql(newSelfCares[1].type)
                   expect(res.body[0].rating).to.eql(newSelfCares[0].rating)
                   expect(res.body[1].rating).to.eql(newSelfCares[1].rating)
                   expect(res.body[0]).to.have.property('user_id')
                    expect(res.body[1]).to.have.property('user_id')
                    expect(res.body[0]).to.have.property('id')
                    expect(res.body[1]).to.have.property('id')
                })

        })//end of it creates new entries

        const requiredFields = ['content', 'type', 'rating']

        requiredFields.forEach(field=>{
            const newSelfCare = [{
                content:"test content",
                type:"emotional",
                rating:2
            }]

            it(`responds with a 400 and an error message when ${field} is missing`,()=>{
                delete newSelfCare[0][field]

                return supertest(app)
                    .post('/api/selfcares')
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .send(newSelfCare)
                    .expect(400,{ error: {message : `Missing '${field}' in request body`}
                    })

            })//end of it required field
        })//end of forEach

        it(`responds with 400 and error message when type not valid`,()=>{
            //this.retries(3)
            //will add in a user_id to newSelfCares
            const newSelfCare=[
                {
                    content:"test content",
                    type:"not valid",
                    rating:2
                }
            ]
            return supertest(app)
                    .post('/api/selfcares')
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .send(newSelfCare)
                    .expect(400,{ error: {message : `Type must be physical, intellectual, spiritual, emotional`}
                    })
        })//end of it not valid type

        it(`responds with 400 and error message when rating not valid`,()=>{
            //this.retries(3)
            //will add in a user_id to newSelfCares
            const newSelfCare=[
                {
                    content:"test content",
                    type:"physical",
                    rating:800
                }
            ]
            return supertest(app)
                    .post('/api/selfcares')
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .send(newSelfCare)
                    .expect(400,{ error: {message : `Rating must be between 1-10`}
                    })
        })//end of it not valid type

    })//end of describe POST /selfcares

})//end describe endpoint