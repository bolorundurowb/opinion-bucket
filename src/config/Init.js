import seeder from 'mongoose-seed';
import path from 'path';
import config from './Config';
import logger from './Logger';
import User from '../models/User';
import data from './seeds/data.json';
import categories from './seeds/categories';
import Category from './../models/Category';

seeder.connect(config.database, () => {
  seeder.loadModels([
    path.join(path.dirname(__dirname), '/models/Role.js'),
  ]);

  seeder.clearModels(['Role'], () => {
    seeder.populateModels(data, () => {
      User.findOne({ username: process.env.ADMIN_USERNAME }, (err, user) => {
        if (err) {
          logger.error(err);
          logger.log('An error occurred when retrieving the admin');

          process.exit(1);
        } else if (!user) {
          user = new User({
            username: process.env.ADMIN_USERNAME,
            password: process.env.ADMIN_PASS,
            email: process.env.ADMIN_EMAIL,
            role: 2
          });

          user.save((err) => {
            if (err) {
              logger.error(err);
              logger.log('An error occurred when creating the admin');

              process.exit(1);
            } else {
              logger.log('The default admin added successfully');

              process.exit(0);
            }
          });
        } else {
          logger.log('default admin already exists');

          process.exit(0);
        }
      });

      Category.find({}, (err, _categories) => {
        if (err) {
          logger.error(err);
          process.exit(1);
        } else if (_categories.length >= 10) {
          logger.log('Default categories already exist.');
          process.exit(0);
        } else {
          Category.create(categories, (err) => {
            if (err) {
              logger.error(err);
              process.exit(1);
            } else {
              logger.log('The default categories have been added.');
              process.exit(0);
            }
          });
        }
      });
    });
  });
});
