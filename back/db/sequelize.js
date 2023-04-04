const { Sequelize, DataTypes } = require("sequelize");
const UserModel = require('../models/user');
const PollModel = require('../models/poll');

const sequelize = new Sequelize(
    'vue_strawpoll',
    'root',
    '',
    {
        host: 'localhost',
        dialect: 'mariadb',
        port: 3306,
        dialectOptions: {
            timezone: 'Etc/GMT-2',
            socketPath: '/opt/lampp/var/mysql/mysql.sock'
            /* for production 
            
            socketPath: '/var/run/mysqld/mysqld.sock',
           cachingRsaPublicKey: '/var/lib/mysql/public_key.pem', */
        },
        logging: false
    }
);

const User = UserModel(sequelize, DataTypes);
const Poll = PollModel(sequelize, DataTypes);

module.exports = {
    User, Poll
};