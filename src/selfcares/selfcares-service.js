const SelfCaresService ={
    getAllSelfCares(knex){
        return knex.select('*').from('lovemore_selfcares')
    },

    insertSelfCares(knex, newSelfCares){
        return knex 
            .insert(newSelfCares)
            .into('lovemore_selfcares')
            .returning('*')
            .then(rows=>{
                return rows;
            })
    }
}

module.exports = SelfCaresService;