const path = require('path')
const express = require('express')
const xss = require('xss')
const FavoritesService = require('./favorites-service')
const { requireAuth } = require('../middleware/jwt-auth')

const favoritesRouter = express.Router()
const jsonParser = express.json()

const serializeProduct = product => ({
    id: product.id,
    name: xss(product.name, { whiteList: [] }),
    description: xss(product.description, { whiteList: [] }),
    price: product.price,

    stock_s: product.stock_s,
    stock_m: product.stock_m,
    stock_l: product.stock_l,
    stock_xl: product.stock_xl,
    stock_xxl: product.stock_xxl,

    collection_id: product.collection_id,
    date_created: product.date_created,
})

const serializeFavorite = favorite => ({
    id: favorite.id,
    date_created: favorite.date_created,
    user_id: favorite.user_id,
    product_id: favorite.product_id,
    product: serializeProduct(favorite.product || {})
})

favoritesRouter.route('/')
    .get(requireAuth, (req, res, next) => {
        const knexInstance = req.app.get('db')
        FavoritesService.getFavoritesForUser(knexInstance, req.user.id)
            .then(favorites => {
                res.json(favorites.map(serializeFavorite))
            })
            .catch(next)
    })


favoritesRouter.route('/:favorite_id')
    .all(requireAuth, (req, res, next) => {
        FavoritesService.getById(
            req.app.get('db'),
            req.params.favorite_id
        )
            .then(favorite => {
                if (!favorite || favorite.user_id !== req.user.id) {
                    return res.status(404).json({
                        error: { message: `Favorite doesn't exist` }
                    })
                }
                res.favorite = favorite // save the favorite for the next middleware
                next() // don't forget to call next so the next middleware happens!
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeFavorite(res.favorite))
    })
    .delete((req, res, next) => {
        FavoritesService.deleteFavorite(req.app.get('db'), res.favorite.id)
    })

module.exports = favoritesRouter