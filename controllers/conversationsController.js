const conversationModel = require('../models/conversationsModel');

async function getConversationById(req, res){
    const {id} = req.params;
    try{
        const conversations = await conversationModel.getConversationById(id);
        res.status(200).json(conversations);
    }catch(error){
        console.log(error);
        res.status(500).send(error);
    }
}

async function createConversation(req, res){
    const conversation = req.body;
    try{
        const newConversation = await conversationModel.createConversation(conversation);
        res.json(newConversation);
    } catch(error){
        console.log(error);
        res.status(500).send(error);
    }
}

module.exports = {getConversationById, createConversation};