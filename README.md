# Clothing Store Server

This is the server for a full stack clothing store demo app. This server utilizes ExpressJS to expose API endpoints and PostgreSQL to manage the database. For more information please see the client repo. API documentation for each endpoint listed below.

## Client:

Repo: https://github.com/krogank9/clothing-store-client

Demo: https://clothing-store-client.now.sh/

## API Documentation:

### requireAuth middleware

* Accepts Authorization header, in the format "Bearer {token}"
* Can be used to protect any endpoint, and if so, you must attach JWT given at login with request in header.

### Auth

* /login POST
  * Accepts "user_name" and "password" keys in request body.
  * Responds with "authToken", "userName", and "userId" on success.
* /refresh POST - REQUIRES AUTHORIZATION
  * Updates the authToken previously given by a login, refreshing its expiry timer.
  * Responds with "authToken", "userName", and "userId" on success.
  
### Users

* Returned user objects contains fields: "id", "date_created", "user_name"

* /users POST
  * Accepts "user_name" and "password" keys in request body.
  * Responds with newly created user's object.
* /users/:user_id GET
  * Returns user object for given id on success.

### Collections

* Returned collection objects contain fields: "id", "name"

* /collections GET
  * Returns array of collection objects that exist in the database.

* /collections/:collection_id GET
  * Returns collection object for given id on success.

### Products

* Returned product objects contain fields: "id", "name", "description", "price", "rating", "numReviews", "collection_id", "date_created", "stock_s", "stock_m", "stock_l", "stock_xl", "stock_xxl"

* /products GET
  * Returns a list of all products in the database in any collection.
  * Optionally, you may supply ?search_query= to filter by text, ?collection_id= to filter by collection and only display products from that collection

* /products/:product_id GET
  * Returns product object for given id on success.

### Favorites

* Returned favorite objects contain fields: "id", "date_created", "user_id", "product_id", "product" - (returns product object above corresponding to review's product_id)

* /favorites GET - REQUIRES AUTH
  * Returns a list of favorites for the currently logged in user. Other users may not see your favorites

* /favorites POST - REQUIRES AUTH
  * Accepts "product_id" key in request body.
  * Returns newly created favorite object on success

* /favorites/:favorite_id GET
  * Returns favorite object for given id on success.

* /favorites/:favorite_id DELETE - REQUIRES AUTH
  * Returns 200 & deletes favorite on success.
  * May only be performed by user who created favorite.

### Reviews

* Returned review objects contain fields: "id", "date_created", "rating", "headline", "content", "user_id", "user_name", "product_id"

* /reviews GET
  * Returns a list of all review objects in the database for any product
  * Optionally, you may supply ?product_id= to retrieve all reviews for a given product

* /reviews POST - REQUIRES AUTH
  * Accepts "rating", "headline", "content", & "product_id" keys in request body.
  * Returns newly created review object on success

* /reviews/:review_id GET
  * Returns review object for given id on success.

* /reviews/:review_id DELETE - REQUIRES AUTH
  * Returns 200 & deletes review on success.
  * May only be performed by user who created post.
