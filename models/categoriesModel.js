const {db} = require('../database/db');

const getAllCategories = async() =>{
    try{
        const query = 'SELECT * FROM categories ORDER BY id ASC;';
        const {rows} = await db.query(query);
        return rows;
    } catch(error){
        console.log(error);
        return error;
    }    
}

const createCategory =  async (category) =>{
    try{
        const query = 'INSERT INTO categories (name) VALUES ($1) RETURNING *;';
        const {rows} = await db.query(query,[category.name]);
        return rows;
    }catch(error){
        console.log(error);
        return error;
    }
}

module.exports = {getAllCategories, createCategory}