const {db} = require('../database/db');

function cesarCipher(str, idx){
    let result = '';
    let alphabet = 'abcdefghijklmnopqrstuvwxyz';
    for(let letter of str){
        let index = alphabet.indexOf(letter);
        letter = letter.toLowerCase();
        if(index != -1){
            let newIndex = (index + idx) % alphabet.length;
            let newLetter = alphabet[newIndex];
            result += newLetter;
        }
    }
    return result;
}

const getAllUsers = async() =>{
    try{
        const query = 'SELECT * FROM users ORDER BY id ASC;';
        const {rows} = await db.query(query);
        return rows;
    } catch(error){
        console.log(error);
        return error;
    }
}

const createUser =  async (user) =>
{
    console.log(user.password);
    let passwordEncrypted = cesarCipher(user.password,3);
    try{
        const query = 'INSERT INTO users (name,email,password) VALUES ($1,$2,$3) RETURNING *;';
        const {rows} = await db.query(query,[user.name,user.email,passwordEncrypted]);
        return rows;
    }catch(error){
        console.log(error);
        return error;
    }
}

const getUserbyEmail = async (email) =>{
    try{
        const query = 'SELECT * FROM users WHERE email = $1;';
        const {rows} = await db.query(query,[email]);
        return rows[0];
    }catch(error){
        console.log(error);
        return error;
    }
}

const checkPassword = async(inputPassword, storedPassword) =>{
    try{
        const encryptedPassword = cesarCipher(inputPassword,3);
        return encryptedPassword === storedPassword;
    }catch(error){
        console.log(error);
        return error;
    }
}

const loginUser = async(email, password) =>{
    let passwordEncrypted = cesarCipher(password,3);
    try{
        const query = 'SELECT * FROM users WHERE email = $1 AND password = $2;';
        const {rows} = await db.query(query,[email,passwordEncrypted]);
        return rows[0];
    }catch(error){
        console.log(error);
        return error;
    
    }
}

module.exports = {getAllUsers, createUser, getUserbyEmail, checkPassword, loginUser};