module.exports = (Sequelize, sequelize) => {
  return sequelize.define("weapons", {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: Sequelize.STRING, allowNull: false },
    dps: { type: Sequelize.INTEGER, allowNull: false },
  });
};
