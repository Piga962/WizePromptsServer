const {db} = require('../database/db');

const getConversationById = async (id) =>{;
    try{
        const query = 'SELECT * FROM conversations WHERE user_id = $1;'
        const {rows} = await db.query(query,[id]);
        return rows;
    }catch(error){
        console.log(error);
        return error;
    }
}

const createConversation = async (conversation) =>{
    try{
        const query = 'INSERT INTO conversations (user_id, title, category_id) VALUES ($1,$2,$3) RETURNING *;';
        const {rows} = await db.query(query, [conversation.user_id, conversation.title, conversation.category_id]);
        return rows;
    }catch(error){
        console.log(error);
        return error;
    }
}

module.exports = {getConversationById, createConversation};
