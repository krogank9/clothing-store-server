const path = require('path')
const express = require('express')
const xss = require('xss')
const CollectionsService = require('./collections-service')
const { requireAuth } = require('../middleware/jwt-auth')

const collectionsRouter = express.Router()
const jsonParser = express.json()

const serializeCollection = collection => ({
    id: collection.id,
    name: xss(collection.name, {whiteList: []}),
})

// Return list of all collections from the database
collectionsRouter.route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        CollectionsService.getAllCollections(knexInstance)
            .then(collections => {
                res.json(collections.map(serializeCollection))
            })
            .catch(next)
    })

// Return a specific collection by its resource ID
collectionsRouter.route('/:collection_id')
    .all((req, res, next) => {
        CollectionsService.getById(
            req.app.get('db'),
            req.params.collection_id
        )
            .then(collection => {
                if (!collection) {
                    return res.status(404).json({
                        error: { message: `Collection doesn't exist` }
                    })
                }
                res.collection = collection // save the collection for the next middleware
                next() // don't forget to call next so the next middleware happens!
            })
            .catch(next)
    })
    .get((req, res, next) => {
        //const knexInstance = req.app.get('db')
        res.json(serializeCollection(res.collection))
    })

module.exports = collectionsRouter