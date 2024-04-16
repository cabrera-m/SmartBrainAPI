// Import required packages and files
const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

// Import controller functions for various routes
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

// Configure and initialize the database connection using knex
const db = knex({
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL, 
  },
});

// Test the database connection by fetching all users
db.select("*")
 .from("users")
 .then((data) => {
    console.log(data);
  });

// Initialize the Express app
const app = express();

// Enable JSON parsing and CORS in the Express app
app.use(express.json());
app.use(cors());

// Root route handler to respond with "success"
app.get("/", (req, res) => {
  res.send("success");
});

// Sign-in route handler with database and bcrypt as dependencies
app.post("/signin", signin.handleSignin(db, bcrypt));

// Registration route handler with database and bcrypt as dependencies
app.post("/register", register.handleRegister(db, bcrypt));

// Profile route handler to fetch user profile by ID
app.get("/profile/:id", profile.handleProfileGet(db));

// Image update route handler with database as a dependency
app.put("/image", image.handleImage(db));

// Image URL generation route handler
app.post("/imageurl", image.handleApiCall);

// Start the Express app on the specified or default port
app.listen(process.env.PORT || 3000, () => {
  console.log(`App is running on port ${process.env.PORT}`);
});