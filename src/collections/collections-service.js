const CollectionsService = {
    getAllCollections(knex) {
        return knex.select('*').from('collections')
    },
    insertCollections(knex, newCollection) {
        return knex
            .insert(newCollection)
            .into('collections')
            .returning('*')
    },
    getById(knex, id) {
        id = parseInt(id) || 0
        return knex.from('collections').select('*').where('id', id).first()
    },
    deleteCollection(knex, id) {
        return knex('collections')
            .where({ id })
            .delete()
    },
    updateCollection(knex, id, newCollectionFields) {
        return knex('boards')
            .where({ id })
            .update(newCollectionFields)
    },
}

module.exports = CollectionsService