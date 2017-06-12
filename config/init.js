/**
 * Created by bolorundurowb on 1/27/17.
 */

const seeder = require('mongoose-seed');
const config = require('./config');
const users = require('./seeds/users.json');

seeder.connect(config.database, function () {
  seeder.loadModels([
    './src/server/models/user.js'
  ]);

  seeder.clearModels(['User'], function () {
    const user = {
      username: 'admin',
      password: process.env.ADMIN_PASS,
      email: 'admin@opinionbucket.io',
      type: 'Admin'
    };
    users[0].documents.push(user);
    seeder.populateModels(users, function () {
      process.exit(0);
    })
  })
});
