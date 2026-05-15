const express = require('express')
const app = express()
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://simpleCrudUser:NQ8t61uoCQZQimDw@cluster0.eae5sfq.mongodb.net/?appName=Cluster0`;

// simpleCrudUser

// NQ8t61uoCQZQimDw

// mongodb+srv://<db_username>:<db_password>@cluster0.eae5sfq.mongodb.net/?appName=Cluster0

// mongodb+srv://simpleCrudUser:NQ8t61uoCQZQimDw@cluster0.eae5sfq.mongodb.net/?appName=Cluster0

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


const run = async () => {
    try{ 
        await client.connect();

         const db = client.db('simpleCrud');
        const userCollection = db.collection('users');

        app.get('/users', async (req, res) => {
            const cursor = userCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });


        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: new ObjectId(id)
            }
            const user = await userCollection.findOne(query)
            console.log('user id', id)
            res.send(user);
        })


         app.post('/users', async (req, res) => {
            const newUser = req.body;
            console.log('user to be inserted', newUser)
            const result = await userCollection.insertOne(newUser);

            res.send(result);
        })


         app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: new ObjectId(id)
            }
            const result = await userCollection.deleteOne(query);
            res.send(result);
        })

        
        await client.db('admin').command({ ping: 1});
        console.log("Pinged your deployment ..You successfully connected mongoDB");
    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Simple CRUD server is running')
})


app.listen(port, () => {
    console.log(`Simple CRUD server is running on port ${port}`);
})