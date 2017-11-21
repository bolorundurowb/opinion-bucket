# opinion-bucket

[![Build Status](https://travis-ci.org/bolorundurowb/opinion-bucket-api.svg?branch=develop)](https://travis-ci.org/bolorundurowb/opinion-bucket-api) [![Coverage Status](https://coveralls.io/repos/github/bolorundurowb/opinion-bucket-api/badge.svg?branch=develop)](https://coveralls.io/github/bolorundurowb/opinion-bucket-api?branch=develop)

RESTful API and App for the upcoming site [http://opinion-bucket.io](http://opinion-bucket.io)

**NB: prefix all routes with `/api/v1`**


## Endpoint table

|Endpoints                    |Verb      | Authentication | Authorization | Description |
|---|:---|:---:|:---:|:---|
| /signIn                | `POST`   | no    | no    | Get authenticated from this route        |
| /signUp                | `POST`   | no    | no    | Create a new user via this route        |
| /signOut               | `POST`   | yes   | no    | Log a user out of the service        |
| /users                      | `GET`    | yes   | yes   | Get a list of all users on the platform        |
| /users/:uid                 | `GET`    | yes   | no    | Get a particular user        |
| /users/:uid                 | `PUT`    | yes   | no    | Updates a particular users' information        |
| /users/:uid                 | `DELETE` | yes   | no    | Remove a user        |
| /topics              | `GET`    | yes    | no     | Get all topics        |
| /topics/:tid         | `GET`    | yes    | no     | Get a specific topic        |
| /topics              | `POST`   | yes    | yes    | Create a new topic        |
| /topics/:tid         | `PUT`    | yes    | yes    | Update a specified topic        |
| /topics/:tid         | `DELETE` | yes    | yes    | Remove a specified topic        |
| /opinions              | `GET`    | yes    | no     | Get all opinions        |
| /opinions/:oid         | `GET`    | yes    | no     | Get a specific opinion        |
| /opinions              | `POST`   | yes    | no    | Create a new opinion        |
| /opinions/:oid         | `PUT`    | yes    | no    | Update a specified opinion        |
| /opinions/:oid         | `DELETE` | yes    | no    | Remove a specified opinion        |
| /categories             | `GET`    | yes    | no    | Get all categories        |
| /categories/:cid        | `GET`    | yes    | no     | Get a specific category        |
| /categories             | `POST`   | yes    | yes    | Create a new category        |
| /categories/:cid        | `PUT`    | yes    | yes    | Update a specified category        |
| /categories/:cid        | `DELETE` | yes    | yes    | Remove a  specified category        |
