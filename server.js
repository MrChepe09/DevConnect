const express = require('express'); //Imported Express
const connectDB = require('./config/db'); //Imported Database Connection Function ( config>>db )

const app = express(); //App initialized using Express

// Connect Database
connectDB(); //Connected to Database
//Go to db file in config folder to know more.........

// Init Middleware
app.use(express.json({ extended: false })); //Body Parser middleware (previously body-parset)
//Now included in Express library

app.get('/', (req, res) => {
  //Primary Route (Just for Testing)
  res.send(`API Running!!`);
});

// Define Routes
//Multiple Route files (To know more go to [routes-->api] folders)
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

const PORT = process.env.PORT || 5000;

//Configuring app to listen to port
app.listen(PORT, () => {
  console.log(`Server running at PORT ${PORT}...`);
});
