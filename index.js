const express = require("express");
const cors = require("cors");

require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const corsConfig = {
  origin: '',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}
app.use(cors(corsConfig))
app.options("", cors(corsConfig))
const port = process.env.PORT || 5000;
const category = require("./Data/Categroy.json");
const toy = require("./Data/Toy.json");

// Middle Ware Use
app.use(cors());
app.use(express.json());

// Assinment   zZ7HpwZXERLdYSZZ

// console.log(process.env.DB_PASS);
const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0i3pjbq.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
 

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const toysCollection = client.db("Toy").collection("toys");

    app.get("/toys", async (req, res) => {
      const cursor = toysCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // toys id search
    app.get("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toysCollection.findOne(query);
      res.send(result);
    });


    // category by toy
    app.get('/toy/:text', async(req, res) =>{
      console.log(req.params.text);
      if(req.params.text == 'sports car' || req.params.text == 'truck' || req.params.text == 'mini police car'){
        const result = await toysCollection.find({category_id : req.params.text}).toArray()
        return res.send(result)
      }
    })

    const database = client.db("toysDB");
    const toyCollection = database.collection("toys");

    app.get("/toy/:category", async (req, res) => {
      const id = req.params.category;
      const result = await toysCollection.find({ category: id }).toArray();
      res.send(result);
    });

   

    app.post("/my_toys", async (req, res) => {
      const user = req.body;
      console.log("user", user);
      const result = await toyCollection.insertOne(user);
      res.send(result);
    });

    app.get("/my_toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toyCollection.findOne(query);
      res.send(result);
    });

    app.put("/my_toys/:id", async (req, res) => {
      const id = req.params.id;
      const toy = req.body;
      console.log(toy);
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateToy = {
        $set: {
          name: toy.name,
          sellerName: toy.sellerName,
          sellerEmail: toy.sellerEmail,
          SubCategory: toy.SubCategory,
          Price: toy.Price,
          Rating: toy.Rating,
          Quantity: toy.Quantity,
          Description: toy.Description,
          Photo: toy.Photo,
        },
      };
      const result = await toyCollection.updateOne(filter, updateToy, options)
      res.send(result)
    });

    // app.get("/my_toys", async (req, res) => {
    //   const cursor = toyCollection.find();
    //   const result = await cursor.toArray();
    //   res.send(result);
    // });


    app.get('/my_toys', async(req, res) =>{
      // console.log(req.query);
      let query = {}
      if(req.query?.email){
        query = {sellerEmail: req.query.email}
      }
      const result = await toyCollection.find(query).toArray()
      res.send(result)
    })

  //   app.get('/myProduct/:email', async(req, res)=>{
  //     // const myEmail = req.params.email
  //     const result = await collectionDataDb.find({sellerEmail : req.params.email}).toArray()
  //     res.send(result)
  //     // console.log(myEmail);
  // })

    app.delete("/my_toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toyCollection.deleteOne(query);
      res.send(result);
    });

    // app.get('/allsToys', async(req, res) =>{
      
    // })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //  client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(port);
