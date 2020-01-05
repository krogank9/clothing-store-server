const knex = require('knex')
const app = require('../src/app')
const { makeCollectionsArray, makeProductsArray, makeUsersArray, makeFavoritesArray, makeReviewsArray, makeMaliciousPost } = require('./clothing-store.fixtures')

describe('Reviews Endpoints', function () {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db.raw('TRUNCATE users, collections, products, reviews RESTART IDENTITY CASCADE'))

  afterEach('cleanup', () => db.raw('TRUNCATE users, collections, products, reviews RESTART IDENTITY CASCADE'))

  describe(`GET /api/reviews`, () => {

    context('Given there is data in the database', () => {
      const testCollections = makeCollectionsArray();
      const testProducts = makeProductsArray();

      const testReviews = makeReviewsArray();
      const expectedReviews = makeReviewsArray(true);

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
                      .into('reviews')
                      .insert(testReviews)
                  })
              })
          })
      })

      it('/api/reviews responds with correct list of reviews', () => {
        return supertest(app)
          .get('/api/reviews')
          .expect(200)
          .expect(res => {
            res.body = res.body.map(p => { return { ...p, "rating": parseInt(p.rating) } })
            expect(res.body).to.eql(expectedReviews)
          })
      })

      it('/api/reviews?product_id=1 responds with correct list of reviews for product 1', () => {
        return supertest(app)
          .get('/api/reviews?product_id=1')
          .expect(200)
          .expect(res => {
            res.body = res.body.map(p => { return { ...p, "rating": parseInt(p.rating) } })
            expect(res.body).to.eql(expectedReviews.filter(r => r.product_id === 1))
          })
      })

      it('/api/reviews/1 responds with correct review resource', () => {
        return supertest(app)
          .get('/api/reviews/1')
          .expect(200)
          .expect(res => {
            res.body = { ...res.body, "rating": parseInt(res.body.rating) }
            expect(res.body).to.eql(expectedReviews[0])
          })
      })

      it('/api/reviews/999 responds with 404 on non existent review resource', () => {
        return supertest(app)
          .get('/api/reviews/999')
          .expect(404)
      })
    })
  })

  // POST /api/reviews
  describe(`POST /api/reviews`, () => {
    const testCollections = makeCollectionsArray();
    const testProducts = makeProductsArray();

    const testReviews = makeReviewsArray();
    const expectedReviews = makeReviewsArray(true);

    const testUsers = makeUsersArray();

    let authToken, userId

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

    beforeEach('insert dummy forum data', () => {
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

    it('/api/reviews create responds with 400 on missing content', () => {
      // now logged in, create favorite
      return supertest(app)
        .post('/api/reviews')
        .set('Authorization', 'Bearer ' + authToken)
        .send({})
        .expect(400)
    })

    it('/api/reviews create responds with correct review on success', () => {

      // now logged in, create favorite
      return supertest(app)
        .post('/api/reviews')
        .set('Authorization', 'Bearer ' + authToken)
        .send({ product_id: 1, rating: 5, headline: "great", content: "very good" })
        .expect(201)
        .expect(res => {
          expect(res.body.user_id).to.eql(userId)
          expect(res.body.product_id).to.eql(1)
          expect(res.body.rating).to.eql(5)
          expect(res.body.content).to.eql("very good")
        })
    })
  })
})