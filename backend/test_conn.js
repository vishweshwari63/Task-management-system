const mongoose = require('mongoose');

const testURI = 'mongodb+srv://focushub_admin:focushub_admin123@cluster0.zwt0s.mongodb.net/focushub?retryWrites=true&w=majority';

mongoose.connect(testURI)
  .then(() => {
    console.log('Success! Connected to MongoDB Atlas Sandbox!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection failed:', err.message);
    process.exit(1);
  });
