const GratitudesService ={
    getAllGratitudes(knex){
        return knex.select('*').from('lovemore_gratitudes')
    },

    insertGratitudes(knex, newGratitudes){
      return knex
        .insert(newGratitudes)
        .into('lovemore_gratitudes')
        .returning('*')
        .then(rows=>{
            return rows;
          })
    }

}

module.exports = GratitudesService;