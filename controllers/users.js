const user = require('../models/user');

 module.exports.getUsers = (req, res) => {
  user.find({})
    .then((users) => {
      if (!users || users.length === 0) {
        return res.status(404).send({ message: 'No users found' });
      }
      return res.status(200).send(users);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err.message });
    });
 }

 module.exports.createUser = (req, res) => {
  const {name, avatar}  =  req.body;
  user.create({name, avatar}).then(user => res.status(201).send(user))
  .catch(err => {
    console.error(err);
    if (err.name === validationError){
      return res.status(400).send({message: err.message})
    }
    return res.status(500).send({ message: err.message });
  });
 }

 module.exports.getSpecificUser = (req, res) => {
   const {userId} = req.params;
  user.findById(userId).orFail(new Error('User not found'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err && err.name === 'CastError') {
        return res.status(400).send({ message: 'Invalid user id' });
      } else if (err && (err.message === 'User not found' || err.name === 'DocumentNotFoundError')) {
        return res.status(404).send({ message: 'User not found' });
      } else {
        return res.status(500).send({ message: err.message });
      }
    });
 }