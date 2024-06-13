const {db} = require('../database/db');

async function getDocumentByCategoryAndUserId(id) {
    console.log(id);
    try{
        const query = 'SELECT document_name FROM documents WHERE category_id = $1 AND user_id = $2;';
        const {rows} = await db.query(query,[id.category_id, id.user_id]);
        return rows;
    } catch(error){
        console.log(error);
        return error;
    }
}

async function createDocument(document) {
    console.log(document);
    try{
        const query = 'INSERT INTO documents (user_id, document_type, document_name, document_route, category_id) VALUES ($1,$2,$3,$4,$5) RETURNING *;';
        const {rows} = await db.query(query, [document.user_id, document.document_type, document.document_name, document.document_route, document.category_id]);
        return rows;
    } catch(error){
        console.log(error);
        return error;
    }
}

module.exports = {getDocumentByCategoryAndUserId, createDocument};