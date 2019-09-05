const { ApolloServer, gql } = require('apollo-server');

// Mock data
const users = [
  { id: 1, name: 'Rebecca', age: 23, friendsIds: [2, 3], height: 160, weight: 45 },
  { id: 2, name: 'Sandy', age: 25, friendsIds: [1], height: 150, weight: 43 },
  { id: 3, name: 'Nathalie', age: 23, friendsIds: [1], height: 162, weight: 50 },
];

const posts = [
  { id: 1, authorId: 1, title: "Hello World!", content: "This is my first post.", likeGiverIds: [2] },
  { id: 2, authorId: 2, title: "Good Night", content: "Have a Nice Dream =)", likeGiverIds: [2, 3] },
  { id: 3, authorId: 1, title: "I Love U", content: "Here's my second post!", likeGiverIds: [] },
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
    posts: [Post]
    height(unit: HeightUnit = CENTIMETER): Float
    weight(unit: WeightUnit = KILOGRAM): Float
  }
  
  type Post {
    id: ID!
    author: User
    title: String
    content: String
    likeGivers: [User]
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

const findUserById = id => users.find(user => user.id === id);
const filterPostsByAuthorId = authorId => posts.filter(post => post.authorId === authorId);

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
    posts: (parent, args, context) => {
      return filterPostsByAuthorId(parent.id);
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
  },
  Post: {
    author: (parent, args, context) => {
      return findUserById(parent.authorId);
    },
    likeGivers: (parent, args, context) => {
      return parent.likeGiverIds.map(id => findUserById(id));
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`? Server ready at ${url}`);
});