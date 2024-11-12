const userResolvers = require('./user');
const postResolvers = require('./post');

module.exports = {
  Query: {
    ...userResolvers.Query,
    ...postResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
  }
};
