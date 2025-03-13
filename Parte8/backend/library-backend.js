const mongoose = require("mongoose");
const { ApolloServer, gql } = require("apollo-server");
const Author = require("./models/author");
const Book = require("./models/book");
require("./utils/db");

const resolvers = {
  Query: {
    allBooks: async (_, { author, genre }) => {
      let query = {};
      if (author) {
        const authorDoc = await Author.findOne({ name: author });
        if (authorDoc) query.author = authorDoc._id;
        else return [];
      }
      if (genre) {
        query.genres = { $in: [genre] }; 
      }
      return Book.find(query).populate("author");
    },

    bookCount: async () => Book.countDocuments(),

    allAuthors: async () => {
      const authors = await Author.find().lean();
      return Promise.all(
        authors.map(async (author) => ({
          ...author,
          bookCount: await Book.countDocuments({ author: author._id }),
        }))
      );
    },
  },

  Mutation: {
    addBook: async (_, { title, author, published, genres }) => {
      let authorDoc = await Author.findOne({ name: author });

      if (!authorDoc) {
        authorDoc = new Author({ name: author });
        await authorDoc.save();
      }

      const newBook = new Book({
        title,
        published,
        genres,
        author: authorDoc._id,
      });

      await newBook.save();
      return Book.findById(newBook._id).populate("author");  
    },

    editAuthor: async (_, { name, setBornTo }) => {
      return Author.findOneAndUpdate(
        { name },
        { born: setBornTo },
        { new: true }
      );
    },
  },
};

const server = new ApolloServer({
  typeDefs: gql`
    type Author {
      name: String!
      born: Int
      bookCount: Int!
    }
    type Book {
      title: String!
      published: Int!
      author: Author!
      genres: [String!]!
    }
    type Query {
      allBooks(author: String, genre: String): [Book!]!
      bookCount: Int!
      allAuthors: [Author!]!
    }
    type Mutation {
      addBook(
        title: String!
        author: String!
        published: Int!
        genres: [String!]!
      ): Book!
      editAuthor(name: String!, setBornTo: Int!): Author
    }
  `,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Servidor listo en ${url}`);
});
