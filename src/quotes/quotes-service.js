const QuotesService ={
    getAllQuotes(knex){
        return knex.select('*').from('lovemore_quotes')
    },

}

module.exports = QuotesService;