const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

//Middleware

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fpo4e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const itemsCollection = client.db('freshFruits').collection('items');

        app.get('/item', async (req, res) => {
            const query = {};
            const cursor = itemsCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        });

        app.get('/item/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const items = await itemsCollection.findOne(query);
            res.send(items);
        })




        // PUT
        app.put('/item/:id', async (req, res) => {
            const id = req.params.id;
            const updateQuantity = req.body;
            const query = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedQuan = {
                $set: {
                    quantity: updateQuantity.quantity
                }
            }
            const result = await itemsCollection.updateOne(query, updatedQuan, options)
            res.send(result);

        })

        //POST

        app.post('/item', async (req, res) => {
            const newItem = req.body;
            const result = await itemsCollection.insertOne(newItem);
            res.send(result);
        })

        //DELETE
        app.delete('/item/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await itemsCollection.deleteOne(query);
            res.send(result);

        })


        //My Item
        app.get('/myitem', async (req, res) => {
            const email = req.query.email
            console.log(email);
            const query = { email: email };
            const cursor = itemsCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        });


    }
    finally {
        // await client.close();
    }

}

run().catch(console.dir);

// For Checking Heroku
app.get('/hero', (req, res) => {
    res.send('Heroku is properly Working');
})

app.get('/', (req, res) => {
    res.send('Running My Server for Assignment')
})

app.listen(port, () => {
    console.log('Server is Running', port);
})