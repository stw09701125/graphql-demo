const { ApolloServer, gql } = require('apollo-server');

// Mock data
const users = [
  { id: 1, name: 'Rebecca', age: 23, friendsIds: [2, 3] },
  { id: 2, name: 'Sandy', age: 25, friendsIds: [1] },
  { id: 3, name: 'Nathalie', age: 23, friendsIds: [1] },
];


const typeDefs = gql`
  type Query {
    "A simple type for getting started!"
    hello: String
    me: User
    users: [User]
  }

  type User {
    id: ID!
    name: String
    age: Int
    friends: [User]
  }
`;

const resolvers = {
  Query: {
    hello: () => 'world',
    me: () => users[0],
    users: () => users,
  },
  User: {
    id: (parent) => parent.id,
    name: (parent) => parent.name,
    age: (parent) => parent.age,
    friends: (parent, args, context) => {
      const { friendsIds } = parent;
      return users.filter(user => friendsIds.includes(user.id));
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`? Server ready at ${url}`);
});