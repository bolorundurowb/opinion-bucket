# opinion-bucket

[![Build Status](https://travis-ci.org/bolorundurowb/opinion-bucket.svg?branch=feature%2F%239%2Ftravis-ci)](https://travis-ci.org/bolorundurowb/opinion-bucket) [![Coverage Status](https://coveralls.io/repos/github/bolorundurowb/opinion-bucket/badge.svg?branch=develop)](https://coveralls.io/github/bolorundurowb/opinion-bucket?branch=develop)

RESTful API and App for the upcoming site http://opinionbucket.io


## Endpoint table

|Endpoints                    |Verb      | Authentication | Authorization | Description |
|---|:---|:---:|:---:|:---|
| /api/v1/auth/signin                | `POST`   | no    | no    | Get authenticated from this route        |
| /api/v1/auth/signup                | `POST`   | no    | no    | Create a new user via this route        |
| /api/v1/auth/signout               | `POST`   | yes   | no    | Log a user out of the service        |
| /api/v1/users                      | `GET`    | yes   | yes   | Get a list of all users on the platform        |
| /api/v1/users/:uid                 | `GET`    | yes   | no    | Get a particular user        |
| /api/v1/users/:uid                 | `PUT`    | yes   | no    | Updates a particular users' information        |
| /api/v1/users/:uid                 | `DELETE` | yes   | no    | Remove a user        |
| /api/v1/topics              | `GET`    | yes    | no     | Get all topics        |
| /api/v1/topics/:tid         | `GET`    | yes    | no     | Get a specific topic        |
| /api/v1/topics              | `POST`   | yes    | yes    | Create a new topic        |
| /api/v1/topics/:tid         | `PUT`    | yes    | yes    | Update a specified topic        |
| /api/v1/topics/:tid         | `DELETE` | yes    | yes    | Remove a specified topic        |
| /api/v1/opinions              | `GET`    | yes    | no     | Get all opinions        |
| /api/v1/opinions/:oid         | `GET`    | yes    | no     | Get a specific opinion        |
| /api/v1/opinions              | `POST`   | yes    | no    | Create a new opinion        |
| /api/v1/opinions/:oid         | `PUT`    | yes    | no    | Update a specified opinion        |
| /api/v1/opinions/:oid         | `DELETE` | yes    | no    | Remove a specified opinion        |
| /api/v1/categories             | `GET`    | yes    | no    | Get all categories        |
| /api/v1/categories/:cid        | `GET`    | yes    | no     | Get a specific category        |
| /api/v1/categories             | `POST`   | yes    | yes    | Create a new category        |
| /api/v1/categories/:cid        | `PUT`    | yes    | yes    | Update a specified category        |
| /api/v1/categories/:cid        | `DELETE` | yes    | yes    | Remove a  specified category        |
