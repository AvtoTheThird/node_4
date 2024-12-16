module.exports = (Sequelize) => {
  const sequelize = new Sequelize(
    "turtle_db",
    "your_username",
    "your_password",
    {
      host: "localhost",
      dialect: "postgres",
    }
  );

  const turtles = require("../models/turtle")(Sequelize, sequelize);
  const pizzas = require("../models/pizza")(Sequelize, sequelize);
  const weapons = require("../models/weapon")(Sequelize, sequelize);
  turtles.belongsTo(weapons, { foreignKey: "weaponId" });
  pizzas.hasMany(turtles, {
    foreignKey: "firstFavoritePizzaId",
    as: "firstFavoritePizza",
  });

  pizzas.hasMany(turtles, {
    foreignKey: "secondFavoritePizzaId",
    as: "secondFavoritePizza",
  });
  return {
    turtles,
    pizzas,
    weapons,
    sequelize,
    Sequelize,
  };
};
