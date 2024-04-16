// Defines a function handleProfileGet that takes a database object as an argument
// and returns a function that handles GET requests for user profiles.
const handleProfileGet = (db) => (req, res) => {
  // Destructures the id parameter from the request parameters.
  const { id } = req.params;

  // Uses the database object to select all columns from the "users" table
  // where the id matches the one provided in the request parameters.
  db.select("*")
   .from("users")
   .where({ id })

    // Once the database query is complete, the resulting user data is handled.
   .then((user) => {
      // If the user array has a length greater than zero, meaning a user was found,
      // the first user object in the array is sent as a JSON response.
      if (user.length) {
        res.json(user[0]);
      } else {
        // If no user was found, a 400 status code and an error message are sent.
        res.status(400).json("User not found");
      }
    })

    // If there is an error with the database query, a 400 status code and an error
    // message are sent.
   .catch((err) => res.status(400).json("error retrieving user"));
};

// Exports the handleProfileGet function to be used in other modules.
module.exports = {
  handleProfileGet: handleProfileGet,
};