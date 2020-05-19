const GratitudesService ={
    getAllGratitudes(knex){
        return knex.select('*')
        .from('lovemore_gratitudes')
    },

    getSomeGratitudes(knex, page){   

      const resultsPerPage = 9
      const offset = resultsPerPage * (page - 1)
      const from = `2020-05-18T00:00:00Z`;
      const to = `1960-01-32T23:59:59Z`;
       return knex
       .select('*')
       .from('lovemore_gratitudes')
       .whereBetween('date_modified',[from,to])
       .orderBy([
        { column: 'date_modified', order: 'DESC' },
        ])
        .limit(resultsPerPage)
       .offset(offset)
    },

    getSpecificDateGratitude(knex, date){
      console.log(date.slice(8,10));
      const from = `${date}T00:00:00Z`;
      const to = `${date}T23:59:59Z`;
       return knex
       .select('*')
       .from('lovemore_gratitudes')
       .whereBetween('date_modified', [from,to])
       .orderBy([
        { column: 'date_modified', order: 'DESC' },
        ])
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