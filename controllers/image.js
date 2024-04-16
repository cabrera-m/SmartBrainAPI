// Import the dotenv module and call the config() method to load environment variables from the.env file
const Dotenv = require('dotenv');
Dotenv.config();

// Import the Clarifai module and initialize the Clarifai API instance with the API key from the environment variables
const Clarifai = require("clarifai");
const app = new Clarifai.App({
  apiKey: process.env.CLARIFAI_KEY,
});

// Define a function handleApiCall that takes in a request and response object as parameters
const handleApiCall = (req, res) => {
  // Call the predict method on the app object with the face-detection model and the input from the request body
  // The predict method returns a promise that resolves to the prediction results
  app.models
   .predict(
      {
        id: "face-detection",
        name: "face-detection",
        version: "6dc7e46bc9124c5c8824be4822abe105",
        type: "visual-detector",
      },
      req.body.input
    )
    // If the promise is resolved, send the prediction results as a JSON response
   .then(data => {
      res.json(data);
    })
    // If the promise is rejected, send a 400 Bad Request response with an error message
   .catch(err => res.status(400).json('Unable to process face detection request'));
};

// Define a function handleImage that takes in a database object and returns a function that takes in a request and response object as parameters
const handleImage = (db) => (req, res) => {
  // Destructure the id property from the request body
  const { id } = req.body;

  // Call the where method on the users table in the database with the id and increment the entries column by 1
  // The returning method is called with the entries column to return the updated value
  // The then method is called on the promise to send the updated entries value as a JSON response
  db("users")
   .where("id", "=", id)
   .increment("entries", 1)
   .returning("entries")
   .then((entries) => {
      res.json(entries[0].entries);
    })
    // If the promise is rejected, send a 400 Bad Request response with an error message
   .catch((err) => res.status(400).json("unable to retrieve entries"));
};

// Export the handleImage and handleApiCall functions as named exports
module.exports = {
  handleImage: handleImage,
  handleApiCall: handleApiCall,
};