const { gql } = require('apollo-server-express');
const Post = require('./types/Post');
const User = require('./types/User');
const RootQuery = require('./queries/RootQuery');
const RootMutation = require('./mutations/RootMutation');

const typeDefs = gql`
    ${Post}
    ${User}
    ${RootQuery}
    ${RootMutation}
`;

module.exports = typeDefs;
