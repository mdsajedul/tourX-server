const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.get('/' , (req , res)=>{

   res.send('hello from tourism server :)')

})

app.listen(port,()=>{
    console.log('Server is runnig on port', port);
})