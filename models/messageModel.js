const {db} = require("../database/db");

const getAllMessagesByConversation = async(id) =>{
    try{
        const query = 'SELECT * FROM messages WHERE conversation_id = $1 ORDER BY id ASC;'
        const {rows} = await db.query(query, [id]);
        return rows;
    } catch(error){
        console.log(error);
        return error;
    }    
}

const createMessage = async(message) => {
    console.log(message);
    try{
        const query = 'INSERT INTO messages (user_id, message, answer, file_id, conversation_id) VALUES ($1,$2,$3,$4,$5) RETURNING *;';
        const {rows} = await db.query(query, [message.user_id, message.message, message.answer, message.file_id, message.conversation_id]);
        return rows;
    }catch(error){
        console.log(error);
        return error;
    }
}

module.exports = {getAllMessagesByConversation, createMessage};