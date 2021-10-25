const express = require('express')
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000

// middleware
app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9s2cu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri)

async function run() {
    try {
        await client.connect();
        // console.log("database connect successfully")
        const database = client.db('online_Shop');
        const productCollection = database.collection("products");
        const orderCollection = database.collection('orders');

        // get all products api react e  useeffect use korle data ghula pawa jabe
        app.get('/products', async (req, res) => {
            console.log(req.query);
            const cursor = productCollection.find({});
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const count = await cursor.count();
            // const skip = parseInt()
            let products;
            if (page) {
                products = await cursor.skip(page * size).limit(size).toArray();

            }
            else {
                products = await cursor.limit(size).toArray();

            }



            res.send(
                {
                    count,
                    products
                });

        })

        app.post('/products/byKeys', async (req, res) => {

            const keys = req.body;
            const query = { key: { $in: keys } }
            const products = await productCollection.find(query).toArray()
            res.json(products)
        })

        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result);

        })




    }
    finally {
        // await client.close();
    }

}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Ema-jhon App Server")
})

app.listen(port, () => {
    console.log('Running Ema-jhon Server:', port)
})