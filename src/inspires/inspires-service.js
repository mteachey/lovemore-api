const InspiresService ={
    getAllInspires(knex){
        return knex.select('*').from('lovemore_inspires')
    }
}

module.exports = InspiresService;