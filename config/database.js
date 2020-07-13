
const Sequelize = require('sequelize');
require('custom-env').env('production');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    operatorsAliases: false,
    pool: {
        max: 300,
        min: 0,
        acquire: 10000,
        idle: 10000
    }
});

var database = module.exports = {};
