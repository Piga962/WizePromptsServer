const {db} = require('../database/db');

const getAllCategoriesById = async(id) =>{
    try{
        const query = 'SELECT * FROM categories WHERE user_id = $1;';
        const {rows} = await db.query(query, [id]);
        return rows;
    } catch(error){
        console.log(error);
        return error;
    }    
}

const createCategory =  async (category) =>{
    try{
        const query = 'INSERT INTO categories (name, user_id) VALUES ($1, $2) RETURNING *;';
        const {rows} = await db.query(query,[category.name, category.user_id]);
        return rows;
    }catch(error){
        console.log(error);
        return error;
    }
}

module.exports = {getAllCategoriesById, createCategory}