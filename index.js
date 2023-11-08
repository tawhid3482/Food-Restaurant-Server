const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s64u1mi.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const serviceCollection = client.db("serviceDB").collection("service");
    const servicesCollection = client.db("serviceDB").collection("services");

    const orderCollection = client.db("serviceDB").collection("orders");

    // const wishCollection = client.db("wishDB").collection("wish");

    app.get("/service", async (req, res) => {
      const cursor = serviceCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = {
        projection: {  title: 1, price: 1, service_id: 1, foodImage: 1,foodName:1,quantity:1 },
      };
      const result = await serviceCollection.findOne(query, options);
      res.send(result);
    });

    // services 
    app.get("/services", async (req, res) => {
      // console.log(req.query.email);
      let query = {}; 
      if (req.query?.email) {
        query = { Email: req.query.email }; 
      }
      const page = parseInt(req.query.page)
      const size = parseInt(req.query.size)
      const result = await  servicesCollection.find(query)
      .skip(page * size)
      .limit(size)
      .toArray();
      res.send(result);
    });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = {
        projection: { title: 1, price: 1, service_id: 1, foodImage: 1,foodName:1,quantity:1, foodCategory:1 },
      };
      const result = await servicesCollection.findOne(query, options);
      res.send(result);
    });


    app.post("/services", async (req, res) => {
      const posting = req.body;
      const result = await servicesCollection.insertOne(posting);
      res.send(result);
    });


   app.put("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      const options = { upsert: true };
      const updateProduct = req.body;
      const updatedProducts = {
        $set: {
          foodName: updateProduct.foodName,
          foodCategory: updateProduct.foodCategory,
          price: updateProduct.price,
          quantity: updateProduct.quantity,
          foodOrigin: updateProduct.foodOrigin,
          Description: updateProduct.Description,
          foodImage: updateProduct.foodImage,
          Email: updateProduct.Email,
        },
      };
      const result = await servicesCollection.updateOne(
        query,
        updatedProducts,
        options
      );
      res.send(result);
    });


    app.get('/servicesCount', async(req,res)=>{
      const count = await servicesCollection.estimatedDocumentCount()
      res.send({count})
    })

    app.post("/order", async (req, res) => {
      const posting = req.body;
      const result = await orderCollection.insertOne(posting);
      res.send(result);
    });

    app.get("/order", async (req, res) => {
      // console.log(req.query.email);
      let query = {}; 
      if (req.query?.email) {
        query = { Email: req.query.email }; 
      }
      const result = await orderCollection.find(query).toArray();
      res.send(result);
    });
    

    app.delete("/order/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.send(result);
    });


    // app.post("/wish", async (req, res) => {
    //   const posting = req.body;
    //   const result = await wishCollection.insertOne(posting);
    //   res.send(result);
    // });

    // app.patch("/wish/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const filter = { _id: new ObjectId(id) };
    //   const updated = req.body;
    //   const updateDoc = {
    //     $set: {
    //       status: updated.status,
    //     },
    //   };
    //   const result = await wishCollection.updateOne(filter, updateDoc);
    //   res.send(result);
    // });

    // app.delete("/wish/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) };
    //   const result = await wishCollection.deleteOne(query);
    //   res.send(result);
    // 

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  } finally {
    // Ensure the client is properly closed
    // await client.close();
  }
}

app.get("/", (req, res) => {
  res.send("server site");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

run().catch(console.error);

// // START PART
// const express = require("express");
// const cors = require("cors");
// const app = express();
// const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// require("dotenv").config();

// const port = process.env.PORT || 5000;

// // MIDDLE WARE
// app.use(cors());
// app.use(express.json());

// // SET USER AND PASSWROD

// // const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s64u1mi.mongodb.net/?retryWrites=true&w=majority`;

// const uri = `mongodb+srv://assingment-11-servive-site:Zyu2FEOxMXzy38E3@cluster0.s64u1mi.mongodb.net/?retryWrites=true&w=majority`;

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// // DATABASE
// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();

//     const serviceCollection = client.db("serviceDB").collection("service");
//     const wishCollection = client.db("wishDB").collection("wish");

//     app.get("/service", async (req, res) => {
//       const cursor = serviceCollection.find();
//       const result = await cursor.toArray();
//       res.send(result);
//     });

//     app.get("/service/:id", async (req, res) => {
//       const id = req.params.id;
//       const query = { _id: new ObjectId(id) };
//       const options ={
//         projection: { title: 1, price: 1, service_id: 1, img: 1 },
//       };
//       const result = await serviceCollection.findOne(query, options);
//       res.send(result);
//     });

//     app.post('/wish',async(req,res)=>{
//         const posting = req.body;
//         const result = await wishCollection.insertOne(posting)
//         res.send(result)
//     })

//     app.patch('/wish/:id',async(req,res)=>{
//         const id = req.params.id
//         const filter = {_id: new ObjectId(id)}
//         const updated = req.body
//         const updateDoc ={
//             $set:{
//                 status: updated.status,
//             }
//         }
//         const result = await wishCollection.updateOne(filter,updateDoc)
//         res.send(result)
//     })

//     app.delete('/wish/:id', async(req,res)=>{
//         const id = req.params.id
//         const query = {_id: new ObjectId(id)}
//         const result = await wishCollection.deleteOne(query)
//         res.send(result)
//     })

//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log(
//       "Pinged your deployment. You successfully connected to MongoDB!"
//     );
//   } finally {
//     // Ensures that the client will close when you finish/error
//     // await client.close();
//   }
// }

// // LAST PART
// app.get("/", (req, res) => {
//   res.send("server site");
// });
// app.listen(port, () => {
//   console.log(`server working ${port}`);
// });
