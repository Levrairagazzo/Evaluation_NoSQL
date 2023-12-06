const mongoose = require('mongoose');

// Connect to the local MongoDB database
mongoose.connect('mongodb://localhost/name_age');

const db = mongoose.connection;

// Define a Mongoose schema

// Specify the collection name explicitly
const collectionName = 'collection1';
const User = mongoose.model('User', userSchema, collectionName);

// Insert the new user
const insertUser = async (newUser) => {
  try {
    await db.once('open', () => {
      console.log('Connected to the database');
    });

    const user = await User.create(newUser);
    console.log('User inserted:', user);

    // Example query to find all users after insertion
    const users = await User.find({});
    console.log('All users after insertion:', users);

    // Close the connection after completing the queries
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
  }
};

// Move the export statement outside the db.once callback
module.exports = { insertUser, db };
