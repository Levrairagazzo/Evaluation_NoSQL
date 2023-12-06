const { MongoClient, ObjectId } = require('mongodb');
const express = require('express');
const app = express();


const url = 'mongodb://localhost:27017/';
const dbName = 'restaurants';
const client = new MongoClient(url);

//Connexion à la base mongoDB
client.connect()
  .then(() => {
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('new_york');

    app.use(express.json());

    //Recupérer tous les restaurants
    app.get('/new_york', async (req, res) => {
      try {
        const findResult = await collection.find({}).toArray();
        res.json(findResult);
      } catch (e) {
        console.error(e);
        res.status(500).send('Erreur');
      }
    });

    //Recupérer un restaurant avec son nom
    app.get('/new_york/:name', async (req, res) => {
        try {
            const restaurant = await collection.findOne({ name: req.params.name });
            res.status(200).json(restaurant);
        }
        catch (e) {
            console.error(e);
            res.status(500).send('Erreur');
        }
    });

    //Récuperer restaurant avec son id
    app.get('/new_york/id/:id', async (req, res) => {
        try {
          
            const restaurant = await collection.findOne({ _id: new ObjectId(req.params.id) });
            res.status(200).json(restaurant);
        
        } catch (e) {
          console.error(e);
          res.status(500).send('Erreur');
        }
      });


      //Insérer un nouveau restaurant
      app.post('/new_york', async (req, res) => {
        const newRestaurant = {
            name: req.body.name,
            borough: req.body.borough,
            cuisine: req.body.cuisine,
            restaurant_id: req.body.restaurant_id,
        }

        console.log(newRestaurant);
        try {
          const result = await collection.insertOne(newRestaurant);
          console.log(`A document was inserted with the _id: ${result.insertedId}`);
          res.status(200).json(result);
        } catch (e) {
          console.error(e);
          res.status(500).send('Erreur');
        }
      });

        //Update restaurant avec son id
      app.put('/new_york/:id', async (req, res) => {
    
        const updatedRestaurant = {};
        if (req.body.name) updatedRestaurant.name = req.body.name;
        if (req.body.borough) updatedRestaurant.borough = req.body.borough;
        if (req.body.cuisine) updatedRestaurant.cuisine = req.body.cuisine;
        if (req.body.restaurant_id) updatedRestaurant.restaurant_id = req.body.restaurant_id;
      
        console.log(updatedRestaurant);
        try {
            const existingRestaurant = await collection.findOne({ _id: new ObjectId(restaurantId) });
            if (!existingRestaurant) {
              console.error(`Error: No restaurant found with _id: ${restaurantId}`);
              return res.status(404).send('Restaurant not found');
            }
          const result = await collection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: updatedRestaurant }
          );
      
          if (result.matchedCount === 0) {
            res.status(404).send('Restaurant not found');
          } else if (result.modifiedCount === 0) {
            res.status(200).json({ message: 'No changes made to the restaurant', restaurant_id: req.params.id });
          } else {
            console.log(`A document was updated with the _id: ${req.params.id}`);
            res.status(200).json({ message: 'Restaurant updated', restaurant_id: req.params.id });
          }
        } catch (e) {
          console.error(e);
          res.status(500).send('Erreurt');
        }
      });

      //Delete restaurant avec son id
      app.delete('/new_york/:id', async (req, res) => {
        
        try {
            const existingRestaurant = await collection.findOne({ _id: new ObjectId(restaurantId) });
            if (!existingRestaurant) {
              console.error(`Error: No restaurant found with _id: ${restaurantId}`);
              return res.status(404).send('Restaurant not found');
            }
          const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
      
          if (result.deletedCount === 0) {
            res.status(404).send('Restaurant not found');
          } else {
            console.log(`A document was deleted with the _id: ${req.params.id}`);
            res.status(200).json({ message: 'Restaurant deleted', restaurant_id: req.params.id });
          }
        } catch (e) {
          console.error(e);
          res.status(500).send('Error deleting document');
        }
      });
      
    

    app.listen(3000, () => {
      console.log('Server running on port 3000');
    })
  })
  .catch(console.error);