require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV, CLIENT_ORIGIN } = require('./config')

const authRouter = require('./auth/auth-router')
const collectionsRouter = require('./collections/collections-router')
const favoritesRouter = require('./favorites/favorites-router')
const productsRouter = require('./products/products-router')
const reviewsRouter = require('./reviews/reviews-router')
const usersRouter = require('./users/users-router')

const app = express()

app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);

app.use(morgan((NODE_ENV === 'production') ? 'common' : 'common'))
app.use(helmet())

app.use('/api/auth', authRouter)
app.use('/api/collections', collectionsRouter)
app.use('/api/favorites', favoritesRouter)
app.use('/api/products', productsRouter)
app.use('/api/reviews', reviewsRouter)
app.use('/api/users', usersRouter)

app.get('/', (req, res) => {
	res.send('Hello, world!')
})

app.use(function errorHandler(error, req, res, next) {
	let response
	if (NODE_ENV === 'production') {
		response = { error: 'Server error' }
	} else {
		response = { message: error.message, error }
	}
	res.status(500).json(response)
})

module.exports = app