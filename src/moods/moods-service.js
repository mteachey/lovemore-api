const MoodsService ={
    getAllMoods(knex){
        return knex.select('*').from('lovemore_moods')
    },

    insertMoods(knex, newMood){
        return knex 
            .insert(newMood)
            .into('lovemore_moods')
            .returning('*')
            .then(rows=>{
                return rows[0];
            })
    }
}

module.exports = MoodsService;