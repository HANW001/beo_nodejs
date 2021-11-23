'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config, {
        host: "localhost",
        dialect: "mysql",
        operatorAliases: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    });
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config, {
        host: "localhost",
        dialect: "mysql",
        operatorAliases: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    });
}

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.users = require('./users')(sequelize, Sequelize);
// db.Authority = require('./authority')(sequelize, Sequelize);
// db.Category = require('./category')(sequelize, Sequelize);
// db.Department = require('./department')(sequelize, Sequelize);
// db.Discipline = require('./discipline')(sequelize, Sequelize);
// db.Drawing = require('./drawing')(sequelize, Sequelize);
// db.Photos = require('./photos')(sequelize, Sequelize);
// db.Progress = require('./progress')(sequelize, Sequelize);
// db.Project = require('./project')(sequelize, Sequelize);
// db.ProjectUser = require('./projectUser')(sequelize, Sequelize);
// db.PunchList = require('./punchList')(sequelize, Sequelize);
// db.PunchLoc = require('./punchLoc')(sequelize, Sequelize);
// db.ScheduleDate = require('./scheduleDate')(sequelize, Sequelize);
// db.Stage = require('./stage')(sequelize, Sequelize);
// db.Status = require('./status')(sequelize, Sequelize);
// db.Subsystem = require('./subsystem')(sequelize, Sequelize);
// db.System = require('./system')(sequelize, Sequelize);
// db.TagNumberDetail = require('./tagNumberDetail')(sequelize, Sequelize);
// db.Unit = require('./unit')(sequelize, Sequelize);
// db.User = require('./user')(sequelize, Sequelize);
// db.UserComment = require('./userComment')(sequelize, Sequelize);
// db.PunchListLog = require('./punchListLog')(sequelize, Sequelize);
// db.VwPunchHis = require('./vwPunchHis')(sequelize, Sequelize);

module.exports = db;
