const { ApolloServer, gql } = require('apollo-server');

// Mock data
const users = [
  { id: 1, name: 'Rebecca', age: 23, friendsIds: [2, 3], height: 160, weight: 45 },
  { id: 2, name: 'Sandy', age: 25, friendsIds: [1], height: 150, weight: 43 },
  { id: 3, name: 'Nathalie', age: 23, friendsIds: [1], height: 162, weight: 50 },
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
    height(unit: HeightUnit = CENTIMETER): Float
    weight(unit: WeightUnit = KILOGRAM): Float
  }

  enum HeightUnit {
    METER
    CENTIMETER
    FOOT
  }

  enum WeightUnit {
    KILOGRAM
    GRAM
    POUND
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
    },
    height: (parent, args, context) => {
      const { unit } = args;
      if (!unit || unit === 'CENTIMETER') return parent.height;
      else if (unit === 'METER') return parent.height / 100;
      else if (unit === 'FOOT') return parent.height / 30.48;
      throw new Error(`Height unit "${unit}" not supported.`);
    },
    weight: (parent, args, context) => {
      const { unit } = args;
      if (!unit || unit === 'KILOGRAM') return parent.weight;
      else if (unit === 'GRAM') return parent.weight * 1000;
      else if (unit === 'POUND') return parent.weight / 0.45359237;
      throw new Error('Weight unit "${unit}" not supported.');
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`? Server ready at ${url}`);
});