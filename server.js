const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const register = require("./controllers/register");
const image = require("./controllers/image");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "kevin",
    password: "",
    database: "smart-brain"
  }
});
const app = express();

// Parse bodies.
app.use(bodyParser.json());

// Allow cross origin requests.
app.use(cors());

// Homepage
app.get("/", (req, res) => {
  db.select("*")
    .from("users")
    .then(users => res.send(users));
});

app.post("/signin", (req, res) => signin.handleSignin(req, res, db, bcrypt));
app.post("/register", (req, res) =>
  register.handleRegister(req, res, db, bcrypt)
);
app.get("/profile/:id", (req, res) => profile.handleProfile(req, res, db));
app.put("/image", (req, res) => image.handleImage(req, res, db));

// Start server
app.listen(3000);
