const mongoose = require("mongoose");
const { ApolloServer, gql, UserInputError, AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user"); 
require("./utils/db");
const bcrypt = require('bcryptjs');

const JWT_SECRET = "your_secret_key";

const authenticate = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new AuthenticationError("El token no es válido o ha expirado");
  }
};

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

    me: async (_, __, { user }) => { 
      if (!user) throw new AuthenticationError("No autenticado");
      return user;
    },
  },

  Mutation: {
    createUser: async (_, { username, favoriteGenre }) => {
      try { 
        const passwordHash = await bcrypt.hash("contraseña", 10); 
  
        const user = new User({
          username,
          favoriteGenre,
          passwordHash,  
        });
  
        await user.save();
        return user;
      } catch (error) {
        throw new Error("Error al crear el usuario: " + error.message);
      }
    },

    login: async (_, { username, password }) => { 
      const user = await User.findOne({ username });
      if (!user || password !== "secret") {
        throw new UserInputError("Credenciales inválidas");
      }

      const token = jwt.sign({ username, id: user._id }, JWT_SECRET, {
        expiresIn: "1h", 
      });
      return { value: token };
    },

    addBook: async (_, { title, author, published, genres }, { user }) => { 
      if (!user) throw new AuthenticationError("No autenticado");

      try {
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
      } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
          throw new UserInputError("Error de validación", {
            invalidArgs: Object.keys(error.errors),
            message: error.message,
          });
        }
        throw new Error("Error al agregar el libro");
      }
    },

    editAuthor: async (_, { name, setBornTo }, { user }) => {
      if (!user) throw new AuthenticationError("No autenticado");

      try {
        const author = await Author.findOneAndUpdate(
          { name },
          { born: setBornTo },
          { new: true }
        );

        if (!author) {
          throw new Error("El autor no se encuentra.");
        }

        return author;
      } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
          throw new UserInputError("Error de validación", {
            invalidArgs: Object.keys(error.errors),
            message: error.message,
          });
        }
        throw new Error("Error al editar el autor");
      }
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

    type User {
      username: String!
      favoriteGenre: String!
      id: ID!
    }

    type Token {
      value: String!
    }

    type Query {
      allBooks(author: String, genre: String): [Book!]!
      bookCount: Int!
      allAuthors: [Author!]!
      me: User
    }

    type Mutation {
      addBook(
        title: String!
        author: String!
        published: Int!
        genres: [String!]!
      ): Book!
      editAuthor(name: String!, setBornTo: Int!): Author
      createUser(username: String!, favoriteGenre: String!): User
      login(username: String!, password: String!): Token
    }
  `,
  resolvers,
  context: ({ req }) => {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.split(" ")[1];

    if (token) {
      const user = authenticate(token);
      return { user }; 
    }

    return {}; 
  },
});

server.listen().then(({ url }) => {
  console.log(`Servidor listo en ${url}`);
});
