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
    headline: xss(review.headline, { whiteList: [] }),
    content: xss(review.content, { whiteList: [] }),

    user_id: review.user_id,
    user_name: xss(review.user_name, { whiteList: [] }),
    product_id: review.product_id,
})

reviewsRouter.route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        ReviewsService.getAllReviews(knexInstance, req.query.product_id)
            .then(reviews => {
                res.json(reviews.map(serializeReview))
            })
            .catch(next)
    })
    .post(requireAuth, jsonParser, (req, res, next) => {
        const { rating, headline, content, product_id} = req.body
        const newReview = { "product_id": product_id, "user_id": req.user.id, "rating": rating, "headline": headline, "content": content }

        for (const [key, value] of Object.entries(newReview)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })
            }
        }

        ReviewsService.insertReview(
            req.app.get('db'),
            newReview
        )
            .then(review => {
                res
                    .location(path.posix.join(req.originalUrl, `/${review.id}`))
                    .status(201)
                    .json(serializeReview(review))
            })
            .catch(next)
    })

reviewsRouter.route('/:review_id')
    .all((req, res, next) => {
        ReviewsService.getById(
            req.app.get('db'),
            req.params.review_id
        )
            .then(review => {
                if (!review) {
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
    .delete(requireAuth, (req, res, next) => {
        if(req.user.id !== review.user_id)
            return res.status(401)
        ReviewsService.deleteReview(req.app.get('db'), res.review.id)
    })

module.exports = reviewsRouter