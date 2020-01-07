const path = require('path')
const express = require('express')
const xss = require('xss')
const ProductsService = require('./products-service')
const { requireAuth } = require('../middleware/jwt-auth')

const productsRouter = express.Router()
const jsonParser = express.json()

const serializeProduct = product => ({
    id: product.id,
    name: xss(product.name, { whiteList: [] }),
    description: xss(product.description, { whiteList: [] }),
    price: product.price,

    rating: product.rating,
    numReviews: product.numReviews,

    stock_s: product.stock_s,
    stock_m: product.stock_m,
    stock_l: product.stock_l,
    stock_xl: product.stock_xl,
    stock_xxl: product.stock_xxl,

    collection_id: product.collection_id,
    date_created: product.date_created,
})

// A list of products may be returned with a few options to filter:
// -Search query, by appending ?search_query= to the end of the endpoint
// -Collection query, return all products in collection, by appending ?collection_id= to the endpoint
// Or no filter to return all product
productsRouter.route('/')
    .get(jsonParser, (req, res, next) => {
        const knexInstance = req.app.get('db')
        if (req.query.search_query) {
            ProductsService.searchProducts(knexInstance, req.query.search_query)
                .then(products => {
                    res.json(products.map(serializeProduct))
                })
                .catch(next)
        }
        else {
            ProductsService.getAllProducts(knexInstance, req.query.collection_id)
                .then(products => {
                    //
                    if(req.body && req.body.productIds) {
                        products = products.filter(p => req.body.productIds.contains(p.id))
                    }
                    res.json(products.map(serializeProduct))
                })
                .catch(next)
        }
    })

// Individual products may be retrieved by their ID
productsRouter.route('/:product_id')
    .all((req, res, next) => {
        ProductsService.getById(
            req.app.get('db'),
            req.params.product_id
        )
            .then(product => {
                if (!product) {
                    return res.status(404).json({
                        error: { message: `Product doesn't exist` }
                    })
                }
                res.product = product // save the product for the next middleware
                next() // don't forget to call next so the next middleware happens!
            })
            .catch(next)
    })
    .get((req, res, next) => {
        //const knexInstance = req.app.get('db')
        res.json(serializeProduct(res.product))
    })

module.exports = productsRouter