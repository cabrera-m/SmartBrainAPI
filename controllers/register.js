const handleRegister = (db, bcrypt) => (req, res) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json("Incorrect form submission");
  }
  if (
    !password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/)
  ) {
    return res
      .status(400)
      .json(
        "Password must contain at least one lowercase letter, one uppercase letter, one numeric digit, one special character, and be at least 8 characters long."
      );
  }
  const hash = bcrypt.hashSync(password);
  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .returning("*")
          .insert({
            email: loginEmail[0].email,
            name: name,
            joined: new Date(),
          })
          .then((user) => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) =>
    res.status(400).json("Unable to register. Please try again.")
  );
};

module.exports = {
  handleRegister: handleRegister,
};
