const documentModel = require('../models/documentsModel');

async function getDocumentByCategoryAndUserId(req, res){
    const id = req.body;
    try{
        const document = await documentModel.getDocumentByCategoryAndUserId(id);
        res.status(200).json(document);
    }catch(error){
        console.log(error);
        res.status(500).send(error);
    }   
}

async function createDocument(req, res){
    const document = req.body;
    try{
        const newDocument = await documentModel.createDocument(document);
        res.json(newDocument);
    } catch(error){
        console.log(error);
        res.status(500).send(error);
    }
}

module.exports = {getDocumentByCategoryAndUserId, createDocument};