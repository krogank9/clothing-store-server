const UsersService = require('../users/users-service');

const ReviewsService = {
    // Need to add username to review
    addInfoToReviews(knex, reviews) {
        if(!reviews)
            return reviews

        let r = Array.isArray(reviews) ? reviews : [reviews]

        // return the current number of threads in each board too
        r = r.map(curReview => {
            return UsersService.getById(knex, curReview.user_id).then(user => {
                return { ...curReview, user_name: user.user_name }
            })
        })

        return Array.isArray(reviews) ? Promise.all(r) : r[0]
    },
    getAllReviews(knex, product_id) {
        if(product_id)
            return this.getReviewsForProduct(knex, product_id)
        else
            return knex.select('*').from('reviews').then(r => this.addInfoToReviews(knex, r))
    },
    getReviewsForProduct(knex, productId) {
        return knex.select('*').from('reviews').where('product_id', productId).then(r => this.addInfoToReviews(knex, r))
    },
    insertReview(knex, newReview) {
        return knex
            .insert(newReview)
            .into('reviews')
            .returning('*')
            .then(rows => this.addInfoToReviews(knex, rows[0]))
    },
    getById(knex, id) {
        id = parseInt(id) || 0
        return knex.from('reviews').select('*').where('id', id).first().then(r => this.addInfoToReviews(knex, r))
    },
    deleteReview(knex, id) {
        return knex('reviews')
            .where({ id })
            .delete()
    },
    updateReview(knex, id, newFields) {
        return knex('reviews')
            .where({ id })
            .update(newFields)
    },
}

module.exports = ReviewsService