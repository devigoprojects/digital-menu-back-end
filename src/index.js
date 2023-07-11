const express = require('express');
const connectToDatabase = require('./config/database');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
dotenv.config()
const port = process.env.PORT || 3000;

// instance of express
const app = express();


// middlewares
// app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set('view engine', 'ejs');


// routes
const userRoutes = require('./routes/user_routes');
const collectionRoutes = require('./routes/collection_routes');
const menuRoutes = require('./routes/menu_routes');

app.use('/api/user',userRoutes);
app.use('/api/collection',collectionRoutes);
app.use('/api/menu',menuRoutes);

// database connection
connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server Started`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error.message);
  });