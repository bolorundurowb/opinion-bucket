import Logger from '../config/Logger';
import Topic from '../models/Topic';
import Opinion from '../models/Opinion';

/**
 * Handles topics
 */
class Topics {
  /**
   * Controller method to handle
   * @param {Object} req
   * @param {Object} res
   */
  static getAll(req, res) {
    const filter = {};
    let limit = req.query.limit || 0;

    limit = parseInt(limit, 10);

    let skip = req.query.offset || 0;
    skip = parseInt(skip, 10);

    if (req.query.category) {
      filter.categories = {
        $in: [req.query.category]
      };
    }

    const sort = {};
    if (req.query.order) {
      if (req.query.order === 'date') {
        sort.date = -1;
      } else if (req.query.order === 'opinion') {
        sort.opinionsLength = -1;
      }
    }

    Topic.find(filter)
      .populate('categories')
      .limit(limit)
      .sort(sort)
      .skip(skip)
      .exec((err, topics) => {
        /* istanbul ignore if */
        if (err) {
          Logger.error(err);
          res.status(500)
            .send({ message: 'An error occurred when retrieving topics' });
        }
        res.status(200)
          .send(topics);
      });
  }

  /**
   * Controller method to handle
   * @param {Object} req
   * @param {Object} res
   */
  static getOne(req, res) {
    Topic
    .findOne({ _id: req.params.tid })
    .populate('categories')
    .exec((err, topic) => {
      /* istanbul ignore if */
      if (err) {
        Logger.error(err);
        res.status(500)
        .send({ message: 'An error occurred when retrieving a topic' });
      } else if (!topic) {
        res.status(404)
        .send({ message: 'No topic exists with that id' });
      } else {
        res.status(200)
        .send(topic);
      }
    });
  }

  /**
   * Controller method to handle
   * @param {Object} req
   * @param {Object} res
   */
  static create(req, res) {
    Topic.findOne({ title: req.body.title }, (err, result) => {
      /* istanbul ignore if */
      if (err) {
        Logger.error(err);
        res.status(500)
          .send({ message: 'An error occurred when retrieving a topic' });
      } else if (result) {
        res.status(409)
          .send({ message: 'A topic exists with that title' });
      } else {
        const _topic = new Topic(req.body);
        _topic.save((err, topic) => {
          /* istanbul ignore if */
          if (err) {
            Logger.error(err);
            res.status(500)
              .send({ message: 'An error occurred when saving a topic' });
          }
          res.status(201)
            .send(topic);
        });
      }
    });
  }

  /**
   * Controller method to handle
   * @param {Object} req
   * @param {Object} res
   */
  static update(req, res) {
    const body = req.body;

    Topic.findById(req.params.tid, (err, topic) => {
      /* istanbul ignore if */
      if (err) {
        Logger.error(err);
        res.status(500)
          .send({ message: 'An error occurred when retrieving a topic.' });
      } else if (!topic) {
        res.status(404)
          .send({ message: 'A topic with that id doesn\'t exist.' });
      } else {
        ['title', 'content', 'categories'].forEach((property) => {
          if (body[property]) {
            topic[property] = body[property];
          }
        });

        topic.save((err, _topic) => {
          /* istanbul ignore if */
          if (err) {
            Logger.error(err);
            res.status(500)
              .send({ message: 'An error occurred when saving a topic.' });
          } else {
            res.status(200)
              .send(_topic);
          }
        });
      }
    });
  }

  /**
   * Controller method to handle
   * @param {Object} req
   * @param {Object} res
   */
  static delete(req, res) {
    Topic.findByIdAndRemove(req.params.tid, (err) => {
      /* istanbul ignore if */
      if (err) {
        Logger.error(err);
        res.status(500)
          .send({ message: 'An error occurred when removing a topic' });
      } else {
        res.status(200)
          .send({ message: 'Topic successfully removed' });
      }
    });
  }

  /**
   * Controller method to handle retrieving a bunch of opinions
   * @param {Object} req
   * @param {Object} res
   */
  static getOpinions(req, res) {
    const filter = {
      topicId: req.params.tid
    };

    let limit = req.query.limit || 0;
    limit = parseInt(limit, 10);

    let skip = req.query.offset || 0;
    skip = parseInt(skip, 10);

    const sort = {
      date: -1
    };

    if (req.query.order) {
      if (req.query.order === 'likes') {
        sort.likes = -1;
      } else if (req.query.order === 'dislikes') {
        sort.dislikes = -1;
      }
    }

    if (req.query.author) {
      filter.author = req.query.author;
    }

    Opinion.find(filter)
      .limit(limit)
      .sort(sort)
      .skip(skip)
      .populate('author')
      .exec((err, opinions) => {
        /* istanbul ignore if */
        if (err) {
          Logger.error(err);
          res.status(500)
            .send({ message: 'An error occurred when retrieving opinions' });
        } else {
          const response = opinions.map((opinion) => {
            const value = {
              _id: opinion._id,
              author: opinion.author,
              showName: opinion.showName,
              content: opinion.content,
              title: opinion.title,
              date: opinion.date,
              likes: opinion.likes,
              dislikes: opinion.dislikes,
              topicId: opinion.topicId
            };

            if (req.user) {
              value.isLiked = opinion.likes.users.includes(req.user._id);
              value.isDisliked = opinion.dislikes.users.includes(req.user._id);
            }

            return value;
          });
          res.status(200)
            .send(response);
        }
      });
  }

  /**
   * Controller method to handle retrieving one opinion
   * @param {Object} req
   * @param {Object} res
   */
  static getOpinion(req, res) {
    Opinion.findOne({ _id: req.params.oid, topicId: req.params.tid })
      .populate('author')
      .exec((err, opinion) => {
        /* istanbul ignore if */
        if (err) {
          Logger.error(err);
          res.status(500)
            .send({ message: 'An error occurred when retrieving an opinion' });
        } else if (!opinion) {
          res.status(400)
            .send({ message: 'No opinion exists with that id' });
        } else {
          const response = {
            _id: opinion._id,
            author: opinion.author,
            showName: opinion.showName,
            content: opinion.content,
            title: opinion.title,
            date: opinion.date,
            likes: opinion.likes,
            dislikes: opinion.dislikes,
            topicId: opinion.topicId
          };

          if (req.user) {
            response.isLiked = opinion.likes.users.includes(req.user._id);
            response.isDisliked = opinion.dislikes.users.includes(req.user._id);
          }

          res.status(200)
            .send(response);
        }
      });
  }

  /**
   * Controller method to handle creating an opinion
   * @param {Object} req
   * @param {Object} res
   */
  static createOpinion(req, res) {
    const body = req.body;
    body.topicId = req.params.tid;

    const opinion = new Opinion(body);
    opinion.save((err, _opinion) => {
      /* istanbul ignore if */
      if (err) {
        Logger.error(err);
        res.status(500)
          .send({ message: 'An error occurred when saving an opinion.' });
      } else {
        const response = {
          _id: _opinion._id,
          author: _opinion.author,
          showName: _opinion.showName,
          content: _opinion.content,
          title: _opinion.title,
          date: _opinion.date,
          likes: _opinion.likes,
          dislikes: _opinion.dislikes,
          topicId: _opinion.topicId,
          isLiked: _opinion.likes.users.includes(req.user._id),
          isDisliked: _opinion.dislikes.users.includes(req.user._id)
        };

        res.status(201)
          .send(response);
      }
    });
  }

  /**
   * Controller method to handle updating an opinion
   * @param {Object} req
   * @param {Object} res
   */
  static updateOpinion(req, res) {
    const body = req.body;

    Opinion
      .findOne({ _id: req.params.oid, topicId: req.params.tid }, (err, opinion) => {
      /* istanbul ignore if */
        if (err) {
          Logger.error(err);
          res.status(500)
          .send({ message: 'An error occurred when retrieving an opinion.' });
        } else if (!opinion) {
          res.status(404)
          .send({ message: 'An opinion with that id doesn\'t exist for this topic.' });
        } else {
          ['title', 'content', 'showName'].forEach((property) => {
            if (body[property]) {
              opinion[property] = body[property];
            }
          });

          Topics.saveOpinion(opinion, res);
        }
      });
  }

  /**
   * Controller method to handle deleting an opinion
   * @param {Object} req
   * @param {Object} res
   */
  static removeOpinion(req, res) {
    Opinion
      .findOneAndRemove({
        _id: req.params.oid,
        author: req.user._id,
        topicId: req.params.tid
      })
      .exec((err) => {
        /* istanbul ignore if */
        if (err) {
          Logger.error(err);
          res.status(500)
            .send({ message: 'An error occurred when removing an opinion' });
        } else {
          res.status(200)
            .send({ message: 'Opinion successfully removed' });
        }
      });
  }

  /**
   * Controller method to handle liking an opinion
   * @param {Object} req
   * @param {Object} res
   */
  static likeOpinion(req, res) {
    Opinion.findOne({ _id: req.params.oid, topicId: req.params.tid }, (err, opinion) => {
      /* istanbul ignore if */
      if (err) {
        Logger.error(err);
        res.status(500)
          .send({ message: 'An error occurred when retrieving an opinion.' });
      } else if (!opinion) {
        res.status(404)
          .send({ message: 'An opinion with that id doesn\'t exist for this topic.' });
      } else {
        opinion.likes.number += 1;
        opinion.likes.users.push(req.user._id);
        Topics.saveOpinion(opinion, res);
      }
    });
  }

  /**
   * Controller method to handle unliking an opinion
   * @param {Object} req
   * @param {Object} res
   */
  static unlikeOpinion(req, res) {
    Opinion.findOne({ _id: req.params.oid, topicId: req.params.tid }, (err, opinion) => {
      /* istanbul ignore if */
      if (err) {
        Logger.error(err);
        res.status(500)
          .send({ message: 'An error occurred when retrieving an opinion.' });
      } else if (!opinion) {
        res.status(404)
          .send({ message: 'An opinion with that id doesn\'t exist for this topic.' });
      } else {
        opinion.likes.number -= 1;
        if (opinion.likes.number < 0) {
          opinion.likes.number = 0;
        }
        const index = opinion.likes.users.indexOf(req.user._id);
        if (index !== -1) {
          opinion.likes.users.splice(index, 1);
        }

        Topics.saveOpinion(opinion, res);
      }
    });
  }

  /**
   * Controller method to handle dislikes for an opinion
   * @param {Object} req
   * @param {Object} res
   */
  static dislikeOpinion(req, res) {
    Opinion.findOne({ _id: req.params.oid, topicId: req.params.tid }, (err, opinion) => {
      /* istanbul ignore if */
      if (err) {
        Logger.error(err);
        res.status(500)
          .send({ message: 'An error occurred when retrieving an opinion.' });
      } else if (!opinion) {
        res.status(404)
          .send({ message: 'An opinion with that id doesn\'t exist for this topic.' });
      } else {
        opinion.dislikes.number += 1;
        opinion.dislikes.users.push(req.user._id);
        Topics.saveOpinion(opinion, res);
      }
    });
  }

  /**
   * Controller method to handle undislikes for an opinion
   * @param {Object} req
   * @param {Object} res
   */
  static undislikeOpinion(req, res) {
    Opinion.findOne({ _id: req.params.oid, topicId: req.params.tid }, (err, opinion) => {
      /* istanbul ignore if */
      if (err) {
        Logger.error(err);
        res.status(500)
          .send({ message: 'An error occurred when retrieving an opinion.' });
      } else if (!opinion) {
        res.status(404)
          .send({ message: 'An opinion with that id doesn\'t exist for this topic.' });
      } else {
        opinion.dislikes.number -= 1;
        if (opinion.dislikes.number < 0) {
          opinion.dislikes.number = 0;
        }
        const index = opinion.dislikes.users.indexOf(req.user._id);
        if (index !== -1) {
          opinion.dislikes.users.splice(index, 1);
        }

        Topics.saveOpinion(opinion, res);
      }
    });
  }

  /**
   * Controller method to handle saving opinions
   * @param {Object} opinion
   * @param {Object} res
   */
  static saveOpinion(opinion, res) {
    opinion.save((err, _opinion) => {
      /* istanbul ignore if */
      if (err) {
        Logger.error(err);
        res.status(500)
          .send({ message: 'An error occurred when saving an opinion' });
      } else {
        res.status(200)
          .send(_opinion);
      }
    });
  }
}

export default Topics;
