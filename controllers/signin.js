// Define a function handleSignin that takes in two arguments: db and bcrypt
const handleSignin = (db, bcrypt) => (req, res) => {
  // Destructure the email and password from the request body
  const { email, password } = req.body;

  // Check if email and password are provided in the request body
  if (!email || !password) {
    return res.status(400).json("Incorrect form submission");
  }

  // Use the db object to query the "login" table in the database
  // Select the "email" and "hash" columns where the email matches the one provided in the request body
  db.select("email", "hash")
    .from("login")
    .where("email", "=", email)

    // Once the query is complete, use the bcrypt compareSync method to compare the provided password
    // with the hash retrieved from the database
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);

      // If the passwords match, query the "users" table in the database
      // Select all columns where the email matches the one provided in the request body
      if (isValid) {
        return (
          db
            .select("*")
            .from("users")
            .where("email", "=", email)

            // Once the query is complete, send a JSON response with the user data
            .then((user) => {
              res.json(user[0]);
            })

            // If there is an error with the query, send a 400 status code with an error message
            .catch((err) => res.status(400).json("unable to log in"))
        );
      }

      // If the passwords do not match, send a 400 status code with an error message
      else {
        res.status(400).json("invalid credentials");
      }
    })

    // If there is an error with the initial query, send a 400 status code with an error message
    .catch((err) => res.status(400).json("invalid credentials"));
};

// Export the handleSignin function
module.exports = {
  handleSignin: handleSignin,
};
