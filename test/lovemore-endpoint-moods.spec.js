const knex = require('knex');
const app = require('../src/app')
const { makeUsersArray } = require('./users.fixtures.js')
const { makeMoodsArray } = require('./moods.fixtures.js')

describe.only(`LoveMore endpoint /api/moods`,()=>{
    let db

    before('make knex instance',()=>{
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
          })
          app.set('db', db)
    })

    after(`disconnect from db`,()=>db.destroy())

    before('clean the table', () => db.raw('TRUNCATE lovemore_moods, lovemore_users RESTART IDENTITY CASCADE'))

    afterEach('cleanup',() => db.raw('TRUNCATE lovemore_moods, lovemore_users RESTART IDENTITY CASCADE'))

    describe(`GET /api/moods`,()=>{
        context(`Given no moods`,()=>{
            it(`responds with 200 and an empty list`,()=>{
                return supertest(app)
                .get('/api/moods')
                .expect(200,[])
            })
        })//end context no moods

        context(`Given moods in the db`,()=>{
            const testUsers = makeUsersArray()
            const testmoods = makeMoodsArray()

            beforeEach(`insert users and moods`,()=>{
                return db
                    .into('lovemore_users')
                    .insert(testUsers)
                    .then(()=>{
                        return db
                            .into('lovemore_moods')
                            .insert(testmoods)
                    })
            })//end beforeEach

            it(`responds with all moods`,()=>{
                return supertest(app)
                    .get('/api/moods')
                    .expect(200, testmoods)
            })//end it with moods in db
        })//end context moods in db       
    })//end describe GET

    describe (`POST /api/moods`,()=>{
        const testUsers = makeUsersArray();

        beforeEach(`insert users`,()=>{
            return db
            .into('lovemore_users')
            .insert(testUsers)
        })//end of beforeEach 

        it(`creates new mood entries with a 201 and the new entries with a default user_id`, function(){
            //this.retries(3)
            //will add in a user_id to newmoods
            const newmood=
                {
                    mood_level:1,
                    energy_level:3
                }

            return supertest(app)
                .post('/api/moods')
                .send(newmood)
                .expect(res=>{
                expect(res.body.mood_level).to.eql(newmood.mood_level)
                expect(res.body.energy_level).to.eql(newmood.energy_level)
                expect(res.body).to.have.property('user_id')
                expect(res.body).to.have.property('id')
                })

        })//end of it creates new entries

        const requiredFields = ['mood_level', 'energy_level']

        requiredFields.forEach(field=>{
            const newMood = {
                mood_level:3,
                energy_level:4
            }

            it(`responds with a 400 and an error message when ${field} is missing`,()=>{
                delete newMood[field]

                return supertest(app)
                    .post('/api/moods')
                    .send(newMood)
                    .expect(400,{ error: {message : `Missing '${field}' in request body`}
                    })

            })//end of it required field
        })//end of forEach

        const validFields = ['mood_level', 'energy_level']

        validFields.forEach(field=>{
            const newMood = {
                mood_level:3,
                energy_level:4
            }

            it(`responds with a 400 and an error message when ${field} is missing`,()=>{
                newMood[field] = 80

                return supertest(app)
                    .post('/api/moods')
                    .send(newMood)
                    .expect(400,{ error: {message : `${field} must be between 1-10`}
                    })

            })//end of it required field
        })//end of forEach

    })//end of describe POST /moods

})//end of describe /moods endpoint