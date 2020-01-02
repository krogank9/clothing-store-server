const knex = require('knex')
const app = require('../src/app')
const { makeCollectionsArray, makeProductsArray, makeUsersArray, makeFavoritesArray, makeReviewsArray, makeMaliciousPost } = require('./clothing-store.fixtures')

describe('Favorites Endpoints', function () {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db.raw('TRUNCATE users, collections, products, favorites RESTART IDENTITY CASCADE'))

  afterEach('cleanup', () => db.raw('TRUNCATE users, collections, products, favorites RESTART IDENTITY CASCADE'))

  describe(`GET /api/favorites`, () => {

    context('Given there is data in the database', () => {
      const testCollections = makeCollectionsArray();
      const testProducts = makeProductsArray();

      const testFavorites = makeFavoritesArray();
      const expectedFavorites = makeFavoritesArray(true);

      const testUsers = makeUsersArray();

      beforeEach('insert dummy forum data', () => {
        return db
          .into('users')
          .insert(testUsers)
          .then(() => {
            return db
              .into('collections')
              .insert(testCollections)
              .then(() => {
                return db
                  .into('products')
                  .insert(testProducts)
                  .then(() => {
                    return db
                      .into('favorites')
                      .insert(testFavorites)
                  })
              })
          })
      })

      it('/api/favorites responds 401 unauthorized when not logged in', () => {
        return supertest(app)
          .get('/api/favorites')
          .expect(401)
      })

      it('/api/favorites responds with correct favorites for given user', () => {
        // login first
        return supertest(app)
          .post('/api/auth/login')
          .send({ user_name: "logan", password: "Password1234!" })
          .expect(200)
          .expect(res => {
            expect(res.body.authToken).to.be.a('string')
            expect(res.body.userName).to.eql("logan")
            expect(res.body.userId).to.eql(1)
            let userId = res.body.userId
            let authToken = res.body.authToken

            return supertest(app)
              .get('/api/favorites')
              .set('Authorization', 'Bearer ' + authToken)
              .expect(200)
              .expect(res => {
                expect(res.body).to.eql(expectedFavorites.filter(f => f.user_id === userId))
              })
          })
      })
    })
  })

  // POST /api/favorites
  describe(`POST /api/favorites`, () => {
    const testCollections = makeCollectionsArray();
    const testProducts = makeProductsArray();

    const testFavorites = makeFavoritesArray();
    const expectedFavorites = makeFavoritesArray(true);

    const testUsers = makeUsersArray();

    let userId, authToken

    beforeEach('insert dummy forum data', () => {
      return db
        .into('users')
        .insert(testUsers)
        .then(() => {
          return db
            .into('collections')
            .insert(testCollections)
            .then(() => {
              return db
                .into('products')
                .insert(testProducts)
            })
        })
    })

    beforeEach('login to account', () => {
      // login first
      return supertest(app)
        .post('/api/auth/login')
        .send({ user_name: "logan", password: "Password1234!" })
        .expect(200)
        .expect(res => {
          expect(res.body.authToken).to.be.a('string')
          expect(res.body.userName).to.eql("logan")
          expect(res.body.userId).to.eql(1)
          userId = res.body.userId
          authToken = res.body.authToken
        })
    })

    it('/api/favorites create responds with 400 on missing content', () => {
      // now logged in, create favorite
      return supertest(app)
        .post('/api/favorites')
        .set('Authorization', 'Bearer ' + authToken)
        .send({})
        .expect(400)
    })

    it('/api/favorites create responds with correct post on success', () => {

      // now logged in, create favorite
      return supertest(app)
        .post('/api/favorites')
        .set('Authorization', 'Bearer ' + authToken)
        .send({ product_id: 1 })
        .expect(201)
        .expect(res => {
          expect(res.body.user_id).to.eql(1)
          expect(res.body.product_id).to.eql(1)
        })
    })
  })
})