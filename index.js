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

// database connection 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tmldf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri)

async function run(){
    try{
        await client.connect();
        console.log('Database connected successfully');
        const database = client.db('tourism');
        const servicesCollection = database.collection('packages');

        // GET API ALL 
        app.get('/packages' ,async (req , res)=>{
            const cursor = servicesCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
          
          })

    }
    finally{

    }
}
run().catch(console.dir);




app.get('/' , (req , res)=>{

   res.send('hello from tourism server :)')

})

app.listen(port,()=>{
    console.log('Server is runnig on port', port);
})