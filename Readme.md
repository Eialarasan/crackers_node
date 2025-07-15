# User Management
### Pre requisites
- Node.js and npm should be installed on your system.

## Environment Dependency
- node version: v16.18.0
- npm version: v8.19.2

### Installation
1. Install the dependencies:
    npm install

2. Make sure have mysql database.
    - mysql version: 8.0.32
3. Add seeder
    -npx sequelize-cli db:seed:all
4. Usage
    The API is now running and can be accessed at `http://localhost:8081`.

Example API endpoints:
- Register New User : POST `/api/user/register`
- Login : POST `/api/user/login`
- Refresh token : POST `/api/user/refreshtoken`
- Get a All User list : GET `/api/user/list`
- Create New user : POST `/api/user/add` 
- Update a specific user by Id : POST `/api/user/update`
- Delete a specific user by Id : POST `/api/user/delete`




## Contact
- email: "eialarasan25597@gmail.com"
-phone:7867941687