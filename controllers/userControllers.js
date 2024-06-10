const userModel = require('../models/userModel');

async function getAllUsers(req,res){
    try{
        const users = await userModel.getAllUsers();
        res.json(users);
    }catch(error){
        console.log(error);
        res.status(500).send(error);
    }
}

async function createUser(req,res){
    const user = req.body;
    console.log(user);
    try{
        const newUser = await userModel.createUser(user);
        res.json(newUser);
    }catch(error){
        console.log(error);
        res.status(500).send(error);
    }
}

async function logInUser(req, res){
    const {email, password} = req.body;

    try{
        const user = await userModel.getUserbyEmail(email);
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }

        const isPasswordCorrect = await userModel.checkPassword(password, user.password);

        if(!isPasswordCorrect){
            return res.status(401).json({message: 'Invalid password'});
        }

        const {password: _, userInfo} = user;
        return res.status(200).json({message: 'User logged in', userInfo})

    }catch(error){
        console.log(error);
        res.status(500).send(error);
    }
}

const loginUser = async(req, res) =>{
    const {email, password} = req.body;
    try{
        const user = await userModel.loginUser(email, password);
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        const userInfo = {
            id: user.id,
            name: user.name,
            email: user.email,
        };
        res.json({user: userInfo});  
    }catch(error){
        console.log(error);
    }
}

module.exports = {getAllUsers, createUser, logInUser, loginUser};