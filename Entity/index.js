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
// db.sequelize.sync({force:true})
// db.User = require('./User')(db.sequelize, Sequelize.DataTypes)
// db.Roles = require('./Roles')(db.sequelize, Sequelize.DataTypes)
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