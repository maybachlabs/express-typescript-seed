# Express Typescript Seed
[Node.js](https://nodejs.org) with [Express 4](http://expressjs.com/4x) written in [Typescript](https://www.typescriptlang.org/)

[PostgreSQL](https://www.postgresql.org) database under [Sequelize](http://docs.sequelizejs.com/) ORM

OAuth2 with [Passport](http://passportjs.org/)

Roles based access with [Connect Roles](https://github.com/ForbesLindesay/connect-roles)

Message brokering with [RabbitMQ](https://www.rabbitmq.com/) for running background tasks like sending e-mails and uploading images to S3

Environment based configuration using [Dotenv](https://www.npmjs.com/package/dotenv)

Integration Testing with [SuperTest](https://github.com/visionmedia/supertest)

## Environment Setup
This project uses the [Dotenv](https://www.npmjs.com/package/dotenv) library to load sensitive data such
as database passwords and client secrets. 

There is a `.env.example` file included at the root of this project as an example, rename it to '.env' (.env is not under version control). Update the `.env` file with the pertinent information
for your project.

### RabbitMQ
Install and run [RabbitMQ](https://www.rabbitmq.com/) with the default settings

### Database
You will need a [PostgreSQL](https://www.postgresql.org) database running on localhost:5432

The setup of PostgreSQL is beyond the scope of this guide. Please reference the [Install Guides](https://wiki.postgresql.org/wiki/Detailed_installation_guides)
for help installing PostgreSQL on your machine.

Once PostgreSQL is installed and running, create a new database called `seed`. Create a new user named `seed`. Make this user the owner of the newly created database.
    
Since the tables defined in the entities do not already exist, Sequelize will attempt to build them once you start the server.

## Running the app
    yarn install
    yarn run start
You can also run the app in debug mode and attach a [Debugger](https://www.jetbrains.com/help/webstorm/run-debug-configuration-attach-to-node-js-chrome.html) in Webstorm

    yarn run debug

Once the app is running and the tables are created, you can seed the database with the sequelize-cli.
 Install the sequelize-cli by running 
 
     yarn install --g sequelize-cli
     
 then run 
    
    sequelize db:seed:all 
    
### Running the tests
    yarn run test

## Contact
Kevin Kolz - kckolz@gmail.com

## License
MIT
