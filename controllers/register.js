// Function to handle user registration using the provided db and bcrypt instances
const handleRegister = (db, bcrypt) => (req, res) => {
  // Destructure email, name, and password from the request body
  const { email, name, password } = req.body;

  // Check if all required fields are present in the request body
  if (!email ||!name ||!password) {
    return res.status(400).json("Incorrect form submission");
  }

  // Validate password complexity using a regular expression
  if (
   !password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/)
  ) {
    return res
     .status(400)
     .json(
        "Password must contain at least one lowercase letter, one uppercase letter, one numeric digit, one special character, and be at least 8 characters long."
      );
  }

  // Hash the password using bcrypt
  const hash = bcrypt.hashSync(password);

  // Begin a transaction with the database
  db.transaction((trx) => {
    // Insert the hashed password and email into the 'login' table
    trx
     .insert({
        hash: hash,
        email: email,
      })
     .into("login")
     .returning("email")
     .then((loginEmail) => {
        // Insert the user's email, name, and joined date into the 'users' table
        return trx("users")
         .returning("*")
         .insert({
            email: loginEmail[0].email,
            name: name,
            joined: new Date(),
          })
         .then((user) => {
            // Send the created user as a JSON response
            res.json(user[0]);
          });
      })
     .then(trx.commit)
     .catch(trx.rollback);
  }).catch((err) =>
    res.status(400).json("Unable to register. Please try again.")
  );
};

// Export the handleRegister function
module.exports = {
  handleRegister: handleRegister,
};