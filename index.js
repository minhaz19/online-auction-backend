const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const port = process.env.PORT || 5000;
require('dotenv').config()

const app = express()


app.use(bodyParser.json());
app.use(cors());
// app.use(express.static('doctors'));
// app.use(fileUpload());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dgpqy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



client.connect(err => {
    const productCollection = client.db("OnlineAuction").collection("items");
    const reviewCollection = client.db("OnlineAuction").collection("reviews");
    const bidCollection = client.db("OnlineAuction").collection("bids");
    const adminList = client.db("OnlineAuction").collection("admins");

    app.post('/dashBoard/addProduct', (req, res) => {
        const newProducts = req.body;
        productCollection.insertOne(newProducts)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.post('/dashBoard/Review', (req, res) => {
        const reviewData = req.body;
        reviewCollection.insertOne(reviewData)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/products', (req, res) => {
        productCollection.find()
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.get('/dashboard/biddingsByID', (req, res) => {
        bidCollection.find()
            .toArray((err, order) => {
                res.send(order)
            })
    })

    app.post('/bids', (req, res) => {
        const bid = req.body;
        bidCollection.insertOne(bid)
            .then(result => {
                res.send(result.insertedCount > 0)

            })
    })
    app.get('/admin/biddings', (req, res) => {
        bidCollection.find()
            .toArray((err, order) => {
                res.send(order)
            })
    })

    app.get('/bids', (req, res) => {
        bidCollection.find()
            .toArray((err, order) => {
                console.log(order)
                res.send(order)
            })
    })
    app.post('/admin/makeAdmin', (req, res) => {
        const email = req.body;
        console.log(email);
        adminList.insertOne(email)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });
    
    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        adminList.find({ info: email })
            .toArray((err, admin) => {
                res.send(admin.length > 0);
            })
    })

});


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port);