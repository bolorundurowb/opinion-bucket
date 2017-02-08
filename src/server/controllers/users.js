/**
 * Created by bolorundurowb on 1/11/17.
 */

const Users = require('./../models/user');

const usersCtrl = {
  getAll: function (req, res) {
    Users.find(function (err, users) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(users);
      }
    });
  },

  getOne: function (req, res) {
    Users.findOne({_id: req.params.id}, function (err, user) {
      if (err) {
        res.status(500).send(err);
      } else if (!user) {
        res.status(400).send({message: 'No user exists with that id'});
      } else {
        res.status(200).send(user);
      }
    });
  },

  getOneFull: function (req, res) {
    Users.findOne({_id: req.params.id})
      .populate('topics')
      .exec(function (err, user) {
        if (err) {
          res.status(500).send(err);
        } else if (!user) {
          res.status(400).send({message: 'No user exists with that id'});
        } else {
          res.status(200).send(user);
        }
      });
  },

  update: function (req, res) {
    Users.findById(req.params.id, function (err, user) {
      if (err) {
        res.status(500).send(err);
      } else {
        if (req.body.password) {
          user.password = req.body.password;
        }
        if (req.body.firstName) {
          user.firstName = req.body.firstName;
        }
        if (req.body.lastName) {
          user.lastName = req.body.lastName;
        }
        if (req.body.gender) {
          user.gender = req.body.gender;
        }
        if (req.body.dateOfBirth) {
          user.dateOfBirth = new Date(req.body.dateOfBirth);
        }
        if (req.body.profilePhoto) {
          user.profilePhoto = req.body.profilePhoto;
        }
        if (req.body.topics) {
          if (Array.isArray(req.body.topics)) {
            req.body.topics.forEach(function (topic_id) {
              if (typeof topic_id == 'string') {
                var id = mongoose.Types.ObjectId(topic_id);
                user.topics.push(id);
              } else {
                user.topics.push(topic_id);
              }
            });
          } else {
            var id = mongoose.Types.ObjectId(req.body.topics);
            user.topics.push(id);
          }
        }
        user.topics = Array.from(new Set(user.topics));
        // Critical details
        var queryOptions = [];
        if (req.body.email) {
          queryOptions.push({email: req.body.email});
        }
        if (req.body.username) {
          queryOptions.push({username: req.body.username});
        }
        Users.find({$or: queryOptions}, function (err, result) {
          if (err) {
            res.status(500).send(err);
          } else if (result.length !== 0) {
            res.status(409).send({message: 'A user exists with that username or email address'});
          } else {
            if (req.body.email) {
              user.email = req.body.email;
            }
            if (req.body.username) {
              user.username = req.body.username;
            }
            user.save(function (err, _user) {
              if (err) {
                res.status(500).send(err);
              } else {
                res.status(200).send(_user);
              }
            });
          }
        });
      }
    });
  },

  delete: function (req, res) {
    Users.findByIdAndRemove(req.params.id, function (err) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send({message: 'User successfully removed'});
      }
    });
  }
};

module.exports = usersCtrl;
