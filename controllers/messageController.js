const messageController = require('../models/messageModel');

async function getAllMessagesByConversation(req,res){
    const {id} = req.params;
    try{
        const messages = await messageController.getAllMessagesByConversation(id);
        res.json(messages);
    }catch(error){
        console.log(error);
        res.status(500).send(error);
    }
}

async function createMessage(req,res){
    const message = req.body;
    try{
        const newMessage = await messageController.createMessage(message);
        res.json(newMessage);
    }catch(error){
        console.log(error);
        res.status(500).send(error);
    }
}

module.exports = {getAllMessagesByConversation, createMessage};