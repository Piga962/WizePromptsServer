const {db} = "../database/db";

const getAllMessagesByConversation = async() =>{
    try{
        const query = 'SELECT * FROM messages WHERE conversation_id = $1 ORDER BY id ASC;'
        const {rows} = await db.query(query);
        return rows;
    } catch(error){
        console.log(error);
        return error;
    }    
}