# Swapify API

Swapify is an API designed for a seamless **item-swapping platform**, enabling users to exchange goods without monetary transactions. Built with **NestJS** and **MongoDB**, it powers core functionalities such as **user authentication, item management, messaging, and chat interactions**. The API provides secure and efficient endpoints for managing users, chats, messages, and trade requests, ensuring a smooth and trustworthy swapping experience.

---

## Features

- **User Authentication**:
  - Login with email and password.
  - Register new users.
  - Google OAuth2 login.

- **Chat Management**:
  - Create and manage chats.
  - Send and update messages within chats.

- **User Management**:
  - Retrieve user details.
  - Update user profiles.

- **Message Handling**:
  - Send messages in chats.
  - Update existing messages.

---

## Technologies Used

- **Backend Framework**: [NestJS](https://nestjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/)
- **Authentication**: [JWT](https://jwt.io/), [Google OAuth2](https://developers.google.com/identity/protocols/oauth2)
- **Testing**: [Jest](https://jestjs.io/), [Supertest](https://github.com/visionmedia/supertest)
- **API Documentation**: [Swagger](https://swagger.io/)

---

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Google OAuth2 credentials (for Google login)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/swapify-api.git
   cd swapify-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:
   ```env
   DATABASE_URI=mongodb://localhost:27017/swapify
   JWT_SECRET=your-jwt-secret-key
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

4. Run the application:
   ```bash
   npm run start
   ```

5. Access the API documentation:
   Open your browser and navigate to: [http://localhost:3000/api](http://localhost:3000/api)

## API Endpoints

### Authentication

| Method | Endpoint        | Description                         |
|--------|----------------|-------------------------------------|
| POST   | /auth/login    | Login with email and password.     |
| POST   | /auth/register | Register a new user.               |
| GET    | /auth/google   | Initiate Google OAuth login.       |
| GET    | /auth/callback | Handle Google OAuth callback.      |

### Users

| Method | Endpoint     | Description         |
|--------|-------------|---------------------|
| GET    | /users      | Get all users.      |
| GET    | /users/:id  | Get a user by ID.   |

### Chats

| Method | Endpoint     | Description         |
|--------|-------------|---------------------|
| POST   | /chats      | Create a new chat.  |
| GET    | /chats      | Get all chats.      |
| GET    | /chats/:id  | Get a chat by ID.   |

### Messages

| Method | Endpoint         | Description             |
|--------|-----------------|-------------------------|
| POST   | /messages       | Send a message in a chat. |
| PATCH  | /messages/:id   | Update a message.       |

## Testing

To run the unit tests, use the following command:
```bash
npm test
