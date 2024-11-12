const path = require('path');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const auth = require('./middleware/auth');
const { clearImage } = require('./util/file');
const corsMiddleware = require('./middleware/corsMiddleware');
const errorHandler = require('./middleware/errorHandler');
const upload = require('./src/config/multerConfig');

const app = express();

app.use(bodyParser.json()); // application/json
app.use(upload.single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(corsMiddleware);
app.use(auth);

app.put('/post-image', (req, res, next) => {
  if (!req.isAuth) {
    throw new Error('Not authenticated!');
  }
  if (!req.file) {
    return res.status(200).json({ message: 'No file provided!' });
  }
  if (req.body.oldPath) {
    clearImage(req.body.oldPath);
  }
  return res.status(201).json({ message: 'File stored.', filePath: req.file.path });
});

app.use(errorHandler);

async function startServer() {
  const server = new ApolloServer({ typeDefs, resolvers, context: ({ req }) => ({ req }) });
  await server.start();
  server.applyMiddleware({ app });

  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      app.listen({ port: process.env.PORT || 4000 }, () =>
        console.log(`🚀 Server ready at http://localhost:${process.env.PORT || 4000}${server.graphqlPath}`)
      );
    })
    .catch(err => console.log(err));
}

startServer();
