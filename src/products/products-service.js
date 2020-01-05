const ReviewsService = require('../reviews/reviews-service');

const ProductsService = {
    // Need to add rating info to product
    addInfoToProducts(knex, products) {
        if(!products)
            return products

        let p = Array.isArray(products) ? products : [products]

        // return the rating of product given by reviews
        p = p.map(curProduct => {
            return ReviewsService.getReviewsForProduct(knex, curProduct.id).then(reviews => {
              let rating = 0;
              reviews.forEach(review => {rating += review.rating})
              if(reviews.length > 0)
                  rating /= reviews.length
              return {rating: rating, numReviews: reviews.length}
            }).then(ratingInfo => {
                return { ...curProduct, ...ratingInfo}
            })
        })

        return Array.isArray(products) ? Promise.all(p) : p[0]
    },
    searchProducts(knex, searchQuery) {
        const lowerQuery = searchQuery.toLowerCase()

        return knex.select('*').from('products').then(products => {
            return products.filter(p => p.name.toLowerCase().contains(lowerQuery))
        }).then(p => this.addInfoToProducts(knex, p))
    },
    getAllProducts(knex, collectionId) {
        return knex.select('*').from('products').then(products => products.filter(p => {
            if(!collectionId)
                return true
            return parseInt(p.collection_id) === parseInt(collectionId)
        })).then(p => this.addInfoToProducts(knex, p))
    },
    insertProducts(knex, newProducts) {
        return knex
            .insert(newProducts)
            .into('products')
            .returning('*')
    },
    getById(knex, id) {
        id = parseInt(id) || 0
        return knex.from('products').select('*').where('id', id).first().then(p => this.addInfoToProducts(knex, p))
    },
    deleteProduct(knex, id) {
        return knex('products')
            .where({ id })
            .delete()
    },
    updateProduct(knex, id, newFields) {
        return knex('products')
            .where({ id })
            .update(newFields)
    },
}

module.exports = ProductsService