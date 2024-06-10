const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');

const app = express();
const port = 3001;

const userRoutes = require('./routes/userRoutes');
const conversationRoutes = require('./routes/conversationsRoutes');
const messageRoutes = require('./routes/messageRoutes');
const categoriesRoutes = require('./routes/categoriesRoutes');
const chatRoutes = require('./routes/chatRoutes');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.get('/', (req,res) =>{
    res.send('Funciona xd');
});

app.listen(port, () =>{
    console.log(`Example app listening at http://localhost:${port}`)
})

app.use('/users',userRoutes);
app.use('/conversations', conversationRoutes);
app.use('/messages', messageRoutes);
app.use('/categories', categoriesRoutes);
app.use('/chat', chatRoutes);
