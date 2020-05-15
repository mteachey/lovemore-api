const GoalsService ={
    getAllGoals(knex){
        return knex.select('*').from('lovemore_goals')
    },

    insertGoals(knex, newgoal){
        return knex 
            .insert(newgoal)
            .into('lovemore_goals')
            .returning('*')
            .then(rows=>{
                return rows[0];
            })
    }
}

module.exports = GoalsService;