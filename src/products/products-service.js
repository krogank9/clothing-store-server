const ProductsService = {
    searchProducts(knex, searchQuery) {
        const lowerQuery = searchQuery.toLowerCase()

        return knex.select('*').from('products').then(products => {
            return products.filter(p => p.name.toLowerCase().contains(lowerQuery))
        })
    },
    getAllProducts(knex, collectionId) {
        return knex.select('*').from('products').then(products => products.filter(p => {
            if(!collectionId)
                return true
            return parseInt(p.collection_id) === parseInt(collectionId)
        }))
    },
    insertProducts(knex, newProducts) {
        return knex
            .insert(newProducts)
            .into('products')
            .returning('*')
    },
    getById(knex, id) {
        id = parseInt(id) || 0
        return knex.from('products').select('*').where('id', id).first()
    },
    deleteProduct(knex, id) {
        return knex('products')
            .where({ id })
            .delete()
    },
    updateProduct(knex, id, newFields) {
        return knex('products')
            .where({ id })
            .update(newFields)
    },
}

module.exports = ProductsService