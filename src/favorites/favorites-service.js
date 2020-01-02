const ProductsService = require('../products/products-service');

const FavoritesService = {
    // To each favorite product information is added
    addInfoToFavorites(knex, favorites) {
        if(!favorites)
            return favorites

        let f = Array.isArray(favorites) ? favorites : [favorites]

        // return the current number of threads in each board too
        f = f.map(curFavorite => {
            return ProductsService.getById(knex, curFavorite.id).then(product => {
                return { ...curFavorite, product: product }
            })
        })

        return Array.isArray(favorites) ? Promise.all(f) : f[0]
    },
    getAllFavorites(knex) {
        return knex.select('*').from('favorites').then(fs => this.addInfoToFavorites(knex, fs))
    },
    getFavoritesForUser(knex, userId) {
        return knex.select('*').from('favorites').where('user_id', userId).then(fs => this.addInfoToFavorites(knex, fs))
    },
    insertFavorite(knex, newFavorite) {
        return knex
            .insert(newFavorite)
            .into('favorites')
            .returning('*')
            .then(rows => this.addInfoToFavorites(knex, rows[0]))
    },
    getById(knex, id) {
        id = parseInt(id) || 0
        return knex.from('favorites').select('*').where('id', id).first().then(f => this.addInfoToFavorites(knex, f))
    },
    deleteFavorite(knex, id) {
        return knex('favorites')
            .where({ id })
            .delete()
    },
    updateFavorite(knex, id, newFields) {
        return knex('favorites')
            .where({ id })
            .update(newFields)
    },
}

module.exports = FavoritesService