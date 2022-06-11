const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", "xp781314", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
