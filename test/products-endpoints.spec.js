const knex = require('knex')
const app = require('../src/app')
const { makeCollectionsArray, makeProductsArray, makeUsersArray, makeFavoritesArray, makeReviewsArray, makeMaliciousPost } = require('./clothing-store.fixtures')

describe('Products Endpoints', function () {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db.raw('TRUNCATE collections, products RESTART IDENTITY CASCADE'))

  afterEach('cleanup', () => db.raw('TRUNCATE collections, products RESTART IDENTITY CASCADE'))

  describe(`GET /api/products`, () => {

    context('Given there is data in the database', () => {
      const testCollections = makeCollectionsArray();
      const testProducts = makeProductsArray();

      const expectedProducts = makeProductsArray(true);

      beforeEach('insert dummy clothing store data', () => {
        return db
          .into('collections')
          .insert(testCollections)
          .then(() => {
            return db
              .into('products')
              .insert(testProducts)
          })
      })

      it('/api/products responds with correct list of products', () => {
        return supertest(app)
          .get('/api/products')
          .expect(200)
          .expect(res => {
            res.body = res.body.map(p => { return {...p, "price": parseFloat(p.price)} })
            expect(res.body).to.eql(expectedProducts)
          })
      })

      it('/api/products?collection_id=1 responds with correct list of products for collection 1', () => {
        return supertest(app)
          .get('/api/products?collection_id=1')
          .expect(200)
          .expect(res => {
            res.body = res.body.map(p => { return {...p, "price": parseFloat(p.price)} })
            expect(res.body).to.eql(expectedProducts.filter(t => t.collection_id === 1))
          })
      })

      it('/api/products/1 responds with correct product resource', () => {
        return supertest(app)
          .get('/api/products/1')
          .expect(200)
          .expect(res => {
            res.body = {...res.body, "price": parseFloat(res.body.price)}
            expect(res.body).to.eql(expectedProducts[0])
          })
      })

      it('/api/products/999 responds with 404 on non existent product resource', () => {
        return supertest(app)
          .get('/api/products/999')
          .expect(404)
      })
    })
  })
})