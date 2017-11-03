import Logger from '../config/Logger';
import ImageHandler from './../util/ImageHandler';
import User from '../models/User';

/**
 * Handles users
 */
class Users {
  /**
   * Controller method to handle retrieving all users
   * @param {object} req
   * @param {object} res
   */
  static getAll(req, res) {
    User.find({}, (err, users) => {
      /* istanbul ignore if */
      if (err) {
        Logger.error(err);
        res.status(500).send({ message: 'An error occurred when retrieving users' });
      } else {
        res.status(200).send(users);
      }
    });
  }

  /**
   * Controller method to handle retrieving a user
   * @param {object} req
   * @param {object} res
   */
  static getOne(req, res) {
    User.findOne({ _id: req.params.id }, (err, user) => {
      /* istanbul ignore if */
      if (err) {
        Logger.error(err);
        res.status(500).send({ message: 'An error occurred when retrieving a user' });
      } else if (!user) {
        res.status(400).send({ message: 'No user exists with that id' });
      } else {
        res.status(200).send(user);
      }
    });
  }

  /**
   * Controller method to handle retrieving a user with all data populated
   * @param {object} req
   * @param {object} res
   */
  static getOneFull(req, res) {
    User.findOne({ _id: req.params.id })
      .populate('topics')
      .exec((err, user) => {
        /* istanbul ignore if */
        if (err) {
          Logger.error(err);
          res.status(500).send({ message: 'An error occurred when retrieving a user' });
        } else if (!user) {
          res.status(400).send({ message: 'No user exists with that id' });
        } else {
          res.status(200).send(user);
        }
      });
  }

  /**
   * Controller method to handle updating a user
   * @param {object} req
   * @param {object} res
   */
  static update(req, res) {
    const body = req.body;

    User.findById(req.params.id, (err, user) => {
      /* istanbul ignore if */
      if (err) {
        Logger.error(err);
        res.status(500).send({ message: 'An error occurred when retrieving a user' });
      } else if (!user) {
        res.status(404).send({ message: 'No user with that id' });
      } else {
        ['firstName', 'lastName', 'gender', 'dateOfBirth', 'email', 'topics'].forEach((property) => {
          if (body[property]) {
            user[property] = body[property];
          }
        });

        ImageHandler.uploadImage(req.file)
          .then((url) => {
            user.profilePhoto = url || user.profilePhoto;
            user.save((err, _user) => {
              /* istanbul ignore if */
              if (err) {
                Logger.error(err);
                res.status(500).send({ message: 'An error occurred when saving a user' });
              } else {
                res.status(200).send(_user);
              }
            });
          });
      }
    });
  }

  /**
   * Controller method to handle deleting a user
   * @param {object} req
   * @param {object} res
   */
  static delete(req, res) {
    User.findById(req.params.id, (err, user) => {
      /* istanbul ignore if */
      if (err) {
        Logger.error(err);
        res.status(500).send({ message: 'An error occurred when retrieving a user' });
      } else if (user.username === 'admin') {
        res.status(403).send({ message: 'Admin cannot be removed' });
      } else {
        User.findByIdAndRemove(req.params.id, (err) => {
          /* istanbul ignore if */
          if (err) {
            Logger.error(err);
            res.status(500).send({ message: 'An error occurred when removing a user' });
          } else {
            res.status(200).send({ message: 'User successfully removed' });
          }
        });
      }
    });
  }
}


export default Users;
