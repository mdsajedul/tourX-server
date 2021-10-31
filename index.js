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
        const packagesCollection = database.collection('packages');
        const bookingsCollection = database.collection('bookings');

        // GET API ALL 
        app.get('/packages' ,async (req , res)=>{
            const cursor = packagesCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
          
          })

        //   GET API by id 
        app.get('/packages/:id' ,async (req , res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const package = await packagesCollection.findOne(query)
            res.json(package);
        })
        //POST api for bookings
        app.post('/bookings' ,async (req , res)=>{
            const booking = req.body;
            const result = await bookingsCollection.insertOne(booking);
           res.json(result);
        })

        //GET API for myBookings
        app.get('/bookings/:email' , async(req , res)=>{
            const email = req.params.email;
            const query = {email};
            const cursor = bookingsCollection.find(query);
            const booking = await cursor.toArray()
           res.json(booking)
        
        })

        //DELETE api for myBookings
        app.delete('/bookings/:id', async (req,res) =>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await bookingsCollection.deleteOne(query);
            res.json(result);
        } )

        //GET API for manage all orders
        app.get('/bookings' , async(req , res)=>{
            const cursor = bookingsCollection.find({});
            const booking = await cursor.toArray();
            res.send(booking);
        
        })

        //UPDATE API for booking status
        app.put('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const updateBooking = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updateBooking.name,
                    email: updateBooking.email,
                    phone:updateBooking.phone,
                    age:updateBooking.age,
                    address:updateBooking.address,
                    packageName:updateBooking.packageName,
                    status:updateBooking.status
                },
            };
            const result = await bookingsCollection.updateOne(filter, updateDoc, options)
            console.log('updating', id)
            res.json(result)
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