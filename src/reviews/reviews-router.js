const path = require('path')
const express = require('express')
const xss = require('xss')
const ReviewsService = require('./reviews-service')
const { requireAuth } = require('../middleware/jwt-auth')

const reviewsRouter = express.Router()
const jsonParser = express.json()

const serializeReview = review => ({
    id: review.id,
    date_created: review.date_created,

    rating: review.rating,
    content: xss(review.content, { whiteList: [] }),

    user_id: review.user_id,
    user_name: xss(review.user_name, { whiteList: [] }),
    product_id: review.product_id,
})

reviewsRouter.route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        ReviewsService.getAllReviews(knexInstance, req.params.product_id)
            .then(reviews => {
                res.json(reviews.map(serializeReview))
            })
            .catch(next)
    })

reviewsRouter.route('/:review_id')
    .all(requireAuth, (req, res, next) => {
        ReviewsService.getById(
            req.app.get('db'),
            req.params.review_id
        )
            .then(review => {
                if (!review || review.user_id !== req.user.id) {
                    return res.status(404).json({
                        error: { message: `Review doesn't exist` }
                    })
                }
                res.review = review // save the review for the next middleware
                next() // don't forget to call next so the next middleware happens!
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeReview(res.review))
    })
    .delete((req, res, next) => {
        ReviewsService.deleteReview(req.app.get('db'), res.review.id)
    })

module.exports = reviewsRouter