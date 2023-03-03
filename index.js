let express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config();


app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kyk1ijo.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try {
        const homeInfo = client.db('brasila').collection("homepageInfo");
        const homePromotions = client.db('brasila').collection("homePromotions");
        const roomPageInfo = client.db('brasila').collection("roomPageInfo");
        const allRooms = client.db('brasila').collection("allRooms");
        const Rooms = client.db('brasila').collection("people");
        const restaurantInfo = client.db('brasila').collection("restaurentInfo");
        const servicesPage = client.db('brasila').collection("servicesPage");
        const allservices = client.db('brasila').collection("allservices");
        const users = client.db('brasila').collection("users");
        const booking = client.db('brasila').collection("booking");
        const reviews = client.db('brasila').collection("reviews");



        app.get('/homeInfo', async (req, res) => {
            const query = {};
            const cursor = await homeInfo.find(query).toArray();
            res.send(cursor);
        });

        app.get('/homePromtions', async (req, res) => {
            const query = {};
            const cursor = await homePromotions.find(query).toArray();
            res.send(cursor);
        });

        app.get('/roomPageInfo', async (req, res) => {
            const query = {};
            const cursor = await roomPageInfo.find(query).toArray();
            res.send(cursor);
        });

        app.get('/allRooms', async (req, res) => {
            const query = {};
            const cursor = await allRooms.find(query).toArray();
            res.send(cursor);
        });

        app.get('/allRooms/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const cursor = await allRooms.findOne(query);
            res.send(cursor);
        });

        app.get('/search/:people', async (req, res) => {
            const people = req.params.people;
            const query = { people: people };
            const cursor = await Rooms.find(query).toArray();
            res.send(cursor);
        })

        app.get('/restaurantInfo', async (req, res) => {
            const query = {};
            const cursor = await restaurantInfo.find(query).toArray();
            res.send(cursor);
        });

        app.get('/servicesInfo', async (req, res) => {
            const query = {};
            const cursor = await servicesPage.find(query).toArray();
            res.send(cursor);
        });

        app.get('/allservices', async (req, res) => {
            const query = {};
            const cursor = await allservices.find(query).toArray();
            res.send(cursor);
        });

        // Booking Gets Based On email
        app.get('/mybookings', async (req, res) => {
            const email = req.query.email;
            // console.log(email);
            const query = { email };
            const product = await booking.find(query).toArray();
            res.send(product);
        });

        // Booking Post
        app.post('/booking', async (req, res) => {
            const user = req.body;
            // console.log(user)
            const result = await booking.insertOne(user);
            res.send(result);
        });

        // Payment Routes form room to pay 

        app.get('/pay/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const cursor = await allRooms.findOne(query);
            res.send(cursor);
        });

        // Users Info Post
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await users.insertOne(user);
            res.send(result);
        });

        app.put('/booking/status/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    status: 'Paid'
                }
            }
            const statusUpdated = await booking.updateOne(query, updatedDoc, options,);
            res.send(statusUpdated);
        });

        // Review Post
        app.post('/review', async (req, res) => {
            const user = req.body;
            const result = await reviews.insertOne(user);
            res.send(result);
        });

        // Get Reviews
        app.get('/allreviews', async (req, res) => {
            const query = {};
            const cursor = await reviews.find(query).toArray();
            res.send(cursor);
        });

        app.get('/myreviews', async (req, res) => {
            const email = req.query.email;
            // console.log(email);
            const query = { email };
            const allreviews = await reviews.find(query).toArray();
            res.send(allreviews);
        });

        app.get('/foodreviews', async (req, res) => {
            // const email = req.query.email;
            // console.log(email);
            const query = { category: "food" };
            const allreviews = await reviews.find(query).toArray();
            res.send(allreviews);
        });
        app.get('/environmentreviews', async (req, res) => {
            // const email = req.query.email;
            // console.log(email);
            const query = { category: "environment" };
            const allreviews = await reviews.find(query).toArray();
            res.send(allreviews);
        });
        app.get('/hospitaliltyreviews', async (req, res) => {
            // const email = req.query.email;
            // console.log(email);
            const query = { category: "hospitality" };
            const allreviews = await reviews.find(query).toArray();
            res.send(allreviews);
        });

        //  Delete Booking
        app.delete('/deleteBooking/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const query = { _id: ObjectId(id) };
            // console.log(query);
            const user = await booking.deleteOne(query);
            res.send(user);
        });


        app.get('/myBooking', async (req, res) => {
            const email = req.query.email;
            // console.log(email);
            const query = { email };
            const allreviews = await booking.find(query).toArray();
            res.send(allreviews);
        });



        // -------------------------- Data from another server---------------------------

        // Delete Product from Buyer's product
        // app.delete('/BuyerProduct/:id', async (req, res) => {
        //     const id = req.params.id;
        //     // console.log(id);
        //     const query = { _id: ObjectId(id) };
        //     // console.log(query);
        //     const user = await allBooking.deleteOne(query);
        //     res.send(user);
        // });

        // app.put('/user/verify/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const options = { upsert: true };
        //     const updatedDoc = {
        //         $set: {
        //             status: 'Verified'
        //         }
        //     }
        //     const updatedUser = await userColl.updateOne(query, updatedDoc, options,);
        //     res.send(updatedUser);
        // })

        // Seller Product Gets Based On email
        // app.get('/sellerProductsByEmail', async (req, res) => {
        //     email = req.query.email;
        //     // console.log(email);
        //     const query = { userEmail: email };
        //     const product = await allInfo.find(query).toArray();
        //     res.send(product);
        // });

        // Seller Added Product 
        // app.post('/allProducts', async (req, res) => {
        //     const product = req.body;
        //     const result = await allInfo.insertOne(product);
        //     res.send(result);
        // });





    }
    finally {

    }
};
run().catch(console.log)



app.get('/', async (req, res) => {
    res.send('Brasila Server is Running');
});

app.listen(port, () => console.log(`Server is Running in ${port} Port`))