const dotenv = require('dotenv').config();

export const development = {
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    // Defaults for Postgres
    "host": "127.0.0.1",
    "port": 5432,
    "dialect": "postgres",
    "logging": false
};

export const test = {
    dialect: "sqlite",
    storage: 'tests/sqlite.db',
    logging: false
};

export const production = {
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: "127.0.0.1",
    port: 5432,
    dialect: "postgres",
    logging: false
};

export const facebook = {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    profileFields: ['id', 'name', 'displayName', 'picture', 'email'],
};

export const google = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback',
};
