 const Sequelize=require('sequelize')
require('dotenv').config()

var db = {
    sequelize: new Sequelize({
        host: process.env.HOST,
        database: process.env.DATABASE,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        dialect:'mysql'
     } )
};
db.sequelize.sync({ alter: true }) // This will alter the table to add the new column
db.Order = require('./Order')(db.sequelize, Sequelize.DataTypes)
db.Category = require('./Category')(db.sequelize, Sequelize.DataTypes)
db.SuperAdmin = require('./SuperAdmin')(db.sequelize, Sequelize.DataTypes)
db.Admin = require('./Admin')(db.sequelize, Sequelize.DataTypes)
db.Store = require('./Store')(db.sequelize, Sequelize.DataTypes)
db.Product = require('./Product')(db.sequelize, Sequelize.DataTypes)

Object.keys(db).forEach(function (modelName) {
    if ('associate' in db[modelName]) {
        db[modelName].associate(db);
    }
});
module.exports = db;