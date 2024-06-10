const categoriesModel = require('../models/categoriesModel');

async function getAllCategoriesById(req,res){
    const {id} = req.params;
    try{
        const categories = await categoriesModel.getAllCategoriesById(id);
        res.json(categories);
    }catch(error){
        console.log(error);
        res.status(500).send(error);
    }
}

async function createCategory(req,res){
    const category = req.body;
    try{
        const newCategory = await categoriesModel.createCategory(category);
        res.json(newCategory);
    }catch(error){
        console.log(error);
        res.status(500).send(error);
    }
}

module.exports = {getAllCategoriesById, createCategory};