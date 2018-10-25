const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const clarifai = require("clarifai");
const cors = require("cors");

// Controllers
const image = require("./controllers/image");
const profile = require("./controllers/profile");
const register = require("./controllers/register");
const signin = require("./controllers/signin");

// Setup Database
const knex = require("knex");
// const db = knex({
//   client: 'pg',
//   connection: {
//     host: '127.0.0.1',
//     user: 'kevin',
//     password: '',
//     database: 'smart-brain',
//   },
// });

const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
});

// // Heroku Database Setup
// const {Client} = require('pg');
// const client = new Client({
//   connectionString: process.env.DATABASE_URL,
//   ssl: true,
// });
//
// client.connect();
// client.query(
//   'SELECT table_schema,table_name FROM information_schema.tables;',
//   (err, res) => {
//     if (err) throw err;
//     for (let row of res.rows) {
//       console.log(JSON.stringify(row));
//     }
//     client.end();
//   },
// );

// Launch
const express = require("express");
const app = express();

// Parse bodies.
app.use(bodyParser.json());

// Allow cross origin requests.
app.use(cors());

// Routes
app.get("/", (req, res) => res.send("Server working."));
app.post("/signin", signin.handleSignin(db, bcrypt));
app.post("/register", register.handleRegister(db, bcrypt));
app.get("/profile/:id", profile.handleProfile(db));
app.put("/image", image.handleImage(db));
app.post("/imageurl", image.handleApiCall);

// Start server
let port = parseInt(process.env.PORT) || 8000;
app.listen(port);
