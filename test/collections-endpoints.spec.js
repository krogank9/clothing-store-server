const knex = require('knex')
const app = require('../src/app')
const { makeCollectionsArray, makeProductsArray, makeUsersArray, makeFavoritesArray, makeReviewsArray, makeMaliciousPost } = require('./clothing-store.fixtures')

describe('Collections Endpoints', function () {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db.raw('TRUNCATE collections RESTART IDENTITY CASCADE'))

  afterEach('cleanup', () => db.raw('TRUNCATE collections RESTART IDENTITY CASCADE'))

  describe(`GET /api/collections`, () => {

    context('Given there are collections in the database', () => {
      const testCollections = makeCollectionsArray();

      beforeEach('insert collections', () => {
        return db
          .into('collections')
          .insert(testCollections)
      })

      it('/api/collections responds with correct list of collections', () => {
        return supertest(app)
          .get('/api/collections')
          .expect(200)
          .expect(res => {
            expect(res.body).to.eql(makeCollectionsArray())
          })
      })

      it('/api/collections/1 responds with correct collection resource', () => {
        return supertest(app)
          .get('/api/collections/1')
          .expect(200)
          .expect(res => {
            expect(res.body).to.eql(makeCollectionsArray()[0])
          })
      })

      it('/api/collections/999 responds with 404 on non existent collection resource', () => {
        return supertest(app)
          .get('/api/collections/999')
          .expect(404)
      })
    })
  })
})