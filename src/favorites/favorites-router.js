const path = require('path')
const express = require('express')
const xss = require('xss')
const FavoritesService = require('./favorites-service')
const { requireAuth } = require('../middleware/jwt-auth')

const favoritesRouter = express.Router()
const jsonParser = express.json()

// Product is returned inside of each favorite, so also need serializeProduct function
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
    // The get route is protected by auth, and returns a list of the current user's favorites
    .get(requireAuth, (req, res, next) => {
        const knexInstance = req.app.get('db')
        FavoritesService.getFavoritesForUser(knexInstance, req.user.id)
            .then(favorites => {
                res.json(favorites.map(serializeFavorite))
            })
            .catch(next)
    })
    // Allow a user to associate a favorite product with their account for later retrieval.
    // Each product may only be favorited once
    .post(requireAuth, jsonParser, (req, res, next) => {
        const { product_id } = req.body
        const newFavorite = { "product_id": product_id, "user_id": req.user.id }

        for (const [key, value] of Object.entries(newFavorite)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })
            }
        }

        // If favorite already exists in my favorites, just return success & existing object
        FavoritesService.getFavoritesForUser(req.app.get('db'), req.user.id)
            .then(favorites => {
                favorites = favorites.filter(f => f.product_id === newFavorite.product_id)
                if (favorites.length > 0) {
                    const favorite = favorites[0]
                    res
                        .location(path.posix.join(req.originalUrl, `/${favorite.id}`))
                        .status(201)
                        .json(serializeFavorite(favorite))
                }
                else {
                    // Otherwise, insert as normal
                    FavoritesService.insertFavorite(
                        req.app.get('db'),
                        newFavorite
                    )
                        .then(favorite => {
                            res
                                .location(path.posix.join(req.originalUrl, `/${favorite.id}`))
                                .status(201)
                                .json(serializeFavorite(favorite))
                        })
                        .catch(next)
                }
            })
            .catch(next)
    })


// All favorite resources are protected by auth, as users shouldn't be able to view each other's favorites
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
    // Favorites may be deleted by the user provided the ID
    .delete((req, res, next) => {
        FavoritesService.deleteFavorite(req.app.get('db'), res.favorite.id)
            .then(() => {
                res.status(200).json({})
            })
            .catch(next)
    })

module.exports = favoritesRouter