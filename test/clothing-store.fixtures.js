// If simulateResponse is passed to fixture generate functions,
// add fields that are only returned by server in responses

function makeCollectionsArray() {
  return [
    {
      id: 1,
      name: 'Shirts',
    },
    {
      id: 2,
      name: 'Pants',
    },
    {
      id: 3,
      name: 'Socks',
    },
  ]
}

function makeProductsArray(simulateResponse) {
  let s = simulateResponse
  return [
    {
      ...(s?{rating: 0, numReviews: 0}:{}),
      id: 1,
      collection_id: 1,
      name: 'Brown Shirt',
      description: 'Super comfy brown shirt',
      price: 19.99,
      stock_s: 10,
      stock_m: 10,
      stock_l: 10,
      stock_xl: 10,
      stock_xxl: null,
      date_created: new Date().toISOString()
    },
    {
      ...(s?{rating: 0, numReviews: 0}:{}),
      id: 2,
      collection_id: 2,
      name: 'Jeans',
      description: 'Black slim fit jeans',
      price: 24.99,
      stock_s: 10,
      stock_m: 10,
      stock_l: 10,
      stock_xl: 10,
      stock_xxl: 10,
      date_created: new Date().toISOString()
    },
    {
      ...(s?{rating: 0, numReviews: 0}:{}),
      id: 3,
      collection_id: 3,
      name: 'Wool Socks',
      description: 'Stay warm all winter with these socks',
      price: 9.99,
      stock_s: 10,
      stock_m: 10,
      stock_l: 10,
      stock_xl: null,
      stock_xxl: null,
      date_created: new Date().toISOString()
    },
  ]
}

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: 'logan',
      password: '$2y$12$KO.8g35QGwgvKffmdwG.A.NmkX0JKp6kLN.6UFTEJujbnHo4Qkn9W',//'Password1234!',
    },
    {
      id: 2,
      user_name: 'maggie',
      password: '$2y$12$KO.8g35QGwgvKffmdwG.A.NmkX0JKp6kLN.6UFTEJujbnHo4Qkn9W',//'Password1234!',
    },
    {
      id: 3,
      user_name: 'djole',
      password: '$2y$12$KO.8g35QGwgvKffmdwG.A.NmkX0JKp6kLN.6UFTEJujbnHo4Qkn9W',//'Password1234!',
    },
  ]
}

function makeFavoritesArray(simulateResponse) {
  let s = simulateResponse
  return [
    {
      ...(s?{product: makeProductsArray()[0]}:{}),
      id: 1,
      product_id: 1,
      user_id: 1,
      date_created: new Date().toISOString()
    },
    {
      ...(s?{product: makeProductsArray()[1]}:{}),
      id: 2,
      product_id: 2,
      user_id: 2,
      date_created: new Date().toISOString()
    },
    {
      ...(s?{product: makeProductsArray()[2]}:{}),
      id: 3,
      product_id: 3,
      user_id: 3,
      date_created: new Date().toISOString()
    },
  ];
}

function makeReviewsArray(simulateResponse) {
  let s = simulateResponse
  return [
    {
      ...(s?{user_name: makeUsersArray()[0].user_name}:{}),
      id: 1,
      rating: 5,
      headline: "Good product",
      content: "It's quite good, I liked it a lot.",
      user_id: 1,
      product_id: 1,
      date_created: new Date().toISOString()
    },
    {
      ...(s?{user_name: makeUsersArray()[1].user_name}:{}),
      id: 2,
      rating: 4,
      headline: "",
      content: "",
      user_id: 2,
      product_id: 2,
      date_created: new Date().toISOString()
    },
    {
      ...(s?{user_name: makeUsersArray()[2].user_name}:{}),
      id: 3,
      rating: 1,
      headline: "Bad",
      content: "I thought it was a bad product, I didn't like it.",
      user_id: 3,
      product_id: 3,
      date_created: new Date().toISOString()
    },
  ];
}

// xss module should filter out attack code in posts
function makeMaliciousReview() {
  const maliciousReview = {
    id: 911,
    rating: 5,
    content: 'Naughty naughty very naughty <script>alert("xss");</script>',
    user_id: 1,
    product_id: 1,
    date_created: new Date().toISOString()
  }

  const expectedReview = {
    ...maliciousPost,
    content: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    user_name: makeUsersArray()[0].user_name
  }
  return {
    maliciousReview,
    expectedReview,
  }
}

module.exports = {
  makeCollectionsArray,
  makeProductsArray,
  makeUsersArray,
  makeFavoritesArray,
  makeReviewsArray,
  makeMaliciousReview
}