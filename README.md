### Project overview.

This project allows a user to create and login into his account. After login, one can do CRUD operations with tasks uploaded by him.

### Steps to set up and run the project locally.

1. git clone to a folder of your choice
2. cd into the newly cloned folder
3. run "npm install"
4. run "npm install -g nodemon"
5. Create a .env file inside the cloned folder. The contents are as follows:

PORT = 5000
MONGODB_URI = YOUR_MONGODB_URI
JWT_SECRET = YOUR_JWT_SECRET
JWT_REFRESH_SECRET = YOUR_REFRESH_TOKEN_SECRET

6. Run "npm run dev" to start the server. It starts the server at PORT 5000.

7. You access the APIs via POSTMAN.

8. The /api/login route returns an accessToken and a refreshToken on successful. You can set the Headers in other requests as follows:

{
  Authorization: YOUR_ACCESS_TOKEN
  x-refresh-token: YOUR_REFRESH_TOKEN
}

### Details of the deployed API (base URL).

deployed API URL: 

https://cactro-8april2025.onrender.com

### Postman collection link:

https://red-escape-112378.postman.co/workspace/My-Workspace~23690013-c08f-4f20-893e-accba5deb72c/collection/10619316-1e702db7-9c6e-4e25-87c1-94b5b0c41ce3?action=share&creator=10619316
