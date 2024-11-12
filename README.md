# ShareWorld GraphQL API

ShareWorld GraphQL API is a backend service developed for a social media sharing platform. It is built using Node.js, Express, Apollo Server, and MongoDB.

## Features

- Powerful querying capabilities with GraphQL API
- User authentication and authorization (using JWT)
- CRUD operations for posts
- Image upload support
- Post listing with pagination
- Comprehensive error handling

## Getting Started

These instructions will guide you to set up the project on your local machine for development and testing purposes.

### Prerequisites

The following software needs to be installed to run the project:

- Node.js (v14 or higher)
- npm (usually comes with Node.js)
- MongoDB

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/SametCanMavzer/shareworld-graphql-api.git
   ```

2. Navigate to the project directory:
   ```
   cd shareworld-graphql-api
   ```

3. Install the required packages:
   ```
   npm install
   ```

4. Create a `.env` file and set the necessary environment variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=8080
   JWT_SECRET=your_jwt_secret
   ```

5. Start the application:
   ```
   npm start
   ```

The application will run on `http://localhost:8080/graphql` by default.

## GraphQL Endpoints

### Queries
```graphql
login(email: String!, password: String!): AuthData!
posts(page: Int): PostData!
post(id: ID!): Post!
user: User!
```

### Mutations
```graphql
createUser(userInput: UserInputData): User!
createPost(postInput: PostInputData): Post!
updatePost(id: ID!, postInput: PostInputData): Post!
deletePost(id: ID!): Boolean
updateStatus(status: String!): User!
```

## Technologies Used

- Express.js
- Apollo Server Express
- GraphQL
- MongoDB & Mongoose
- JWT (JSON Web Tokens)
- Multer (File upload)
- Validator
- bcryptjs
- dotenv

## Development

To run in development mode:
```
npm start
```

This command uses `nodemon` to start the application and automatically restart on code changes.

## GraphQL Playground

In development environment, you can use the GraphQL Playground at `http://localhost:8080/graphql` to test your GraphQL queries.

---

Different from the REST API version:
- Uses GraphQL endpoints
- Apollo Server Express integration
- More flexible query structure
- All operations through a single endpoint
