const Sequelize = require("sequelize");
const express = require("express");
const db = require("./context")(Sequelize);
const app = express();

app.use(express.json());

// -------------------------------------------weapons crud-------------------------------------------
app.post("/weapons/add", async (req, res) => {
  try {
    const newWeapon = await db.weapons.create(req.body);
    res.json(newWeapon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/weapons/all", async (req, res) => {
  try {
    const weapons = await db.weapons.findAll();
    res.json(weapons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.delete("/weapons/delete/:id", async ({ params }, res) => {
  try {
    const weapon = await db.weapons.destroy({
      where: {
        id: params.id,
      },
    });

    res.json(`pizza with id ${params.id} deleted`);
  } catch (err) {
    res.status(500).send(err);
  }
});
app.put("/weapons/edit/:id", async ({ body, params }, res) => {
  console.log("putage is happening");
  console.log(body, params);

  try {
    const weapon = await db.weapons.update(body, {
      where: {
        id: params.id,
      },
    });

    res.json(weapon);
  } catch (err) {
    res.status(500).send(err);
  }
});

// -------------------------------------------pizza crud-------------------------------------------
app.post("/pizzas/add", async (req, res) => {
  try {
    const newPizza = await db.pizzas.create(req.body);
    res.json(newPizza);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/pizzas/all", async (req, res) => {
  try {
    const pizzas = await db.pizzas.findAll();
    res.json(pizzas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/pizzas/delete/:id", async ({ params }, res) => {
  try {
    const pizza = await db.pizzas.destroy({
      where: {
        id: params.id,
      },
    });
    res.json(`pizza with id ${params.id} deleted`);
  } catch (err) {
    res.status(500).send(err);
  }
});
app.put("/pizzas/edit/:id", async ({ body, params }, res) => {
  try {
    const pizza = await db.pizzas.update(body, {
      where: {
        id: params.id,
      },
    });
    res.json(pizza);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------------------------------------------turtles crud-------------------------------------------

// adding turtle is implemented below
// fetching all turtles is also implemented below
app.delete("/turtles/delete/:id", async ({ params }, res) => {
  try {
    const turtle = await db.turtles.destroy({
      where: {
        id: params.id,
      },
    });
    res.json(`turtle with id ${params.id} deleted`);
  } catch (err) {
    res.status(500).send(err);
  }
});
app.put("/turtles/edit/:id", async ({ body, params }, res) => {
  try {
    const turtle = await db.turtles.update(body, {
      where: {
        id: params.id,
      },
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

// -------------------------------------------1stt task-------------------------------------------
app.get("/turtles", async (req, res) => {
  try {
    const turtles = await db.turtles.findAll({
      include: [
        { model: db.weapons, as: "weapon" },
        { model: db.pizzas, as: "firstFavoritePizza" },
        { model: db.pizzas, as: "secondFavoritePizza" },
      ],
    });
    res.json(turtles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------------------------------------------2nd task-------------------------------------------
app.get("/turtles/mozarella-lovers", async (req, res) => {
  try {
    const turtles = await db.turtles.findAll({
      include: [
        {
          model: db.pizzas,
          as: "firstFavoritePizza",
          where: { name: "Mozzarella" },
          required: true,
        },
      ],
    });
    res.json(turtles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------------------------------------------3rd task-------------------------------------------
app.get("/pizzas/favorites", async (req, res) => {
  try {
    const pizzas = await db.pizzas.findAll({
      include: [
        { model: db.turtles, as: "firstFavoritePizza" },
        { model: db.turtles, as: "secondFavoritePizza" },
      ],
      distinct: true,
    });
    res.json(pizzas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------------------------------------------4th task-------------------------------------------
app.get("/add-turtle", async (req, res) => {
  try {
    const turtle = await db.turtles.create({
      name: "avto",
      color: "purple",
      weaponId: 4,
      firstFavoritePizzaId: 1,
      secondFavoritePizzaId: 2,
    });
    res.status(201).json(turtle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------------------------------------------5th task-------------------------------------------
app.get("/pizzas/super-fat", async (req, res) => {
  try {
    const [updatedCount] = await db.pizzas.update(
      {
        description: "SUPER FAT PIZZA!",
      },
      { where: { calories: { [Sequelize.Op.gt]: 3000 } } }
    );
    res.json({ message: `${updatedCount} pizzas updated.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------------------------------------------6th task-------------------------------------------
app.get("/weapons/high-dps", async (req, res) => {
  try {
    const weaponCount = await db.weapons.count({
      where: { dps: { [Sequelize.Op.gt]: 100 } },
    });
    res.json({ highDpsWeapons: weaponCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------------------------------------------7th task-------------------------------------------
app.get("/pizzas/:id", async (req, res) => {
  try {
    const pizza = await db.pizzas.findByPk(req.params.id);
    if (!pizza) return res.status(404).json({ error: "Pizza not found" });
    res.json(pizza);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//bulk inserting data for saving time
async function main() {
  await db.sequelize.sync();

  const weaponData = [
    { name: "Nunchaku", dps: 50 },
    { name: "Bo Staff", dps: 40 },
    { name: "Sai", dps: 60 },
    { name: "Katana", dps: 70 },
    { name: "glock-18", dps: 1000 },
  ];
  const weapons = await db.weapons.bulkCreate(weaponData);

  const pizzaData = [
    { name: "Pepperoni", description: "Spicy and delicious", calories: 3500 },
    { name: "Mozzarella", description: "Cheesy goodness", calories: 2000 },
    { name: "Supreme", description: "Loaded with toppings", calories: 3000 },
    { name: "Pineapple", description: "ew", calories: 1500 },
  ];
  const pizzas = await db.pizzas.bulkCreate(pizzaData);

  const turtleData = [
    {
      name: "Leonardo",
      color: "Blue",
      weaponId: weapons[3].id,
      firstFavoritePizzaId: pizzas[0].id,
      secondFavoritePizzaId: pizzas[1].id,
    },
    {
      name: "Michelangelo",
      color: "Orange",
      weaponId: weapons[0].id,
      firstFavoritePizzaId: pizzas[1].id,
      secondFavoritePizzaId: pizzas[2].id,
    },
    {
      name: "Donatello",
      color: "Purple",
      weaponId: weapons[1].id,
      firstFavoritePizzaId: pizzas[2].id,
      secondFavoritePizzaId: pizzas[0].id,
    },
    {
      name: "Raphael",
      color: "Red",
      weaponId: weapons[2].id,
      firstFavoritePizzaId: pizzas[1].id,
      secondFavoritePizzaId: pizzas[0].id,
    },
    {
      name: "avto",
      color: "purple",
      weaponId: weapons[4].id,
      firstFavoritePizzaId: pizzas[2].id,
      secondFavoritePizzaId: pizzas[1].id,
    },
  ];
  await db.turtles.bulkCreate(turtleData);
}
// main().catch(console.error);

db.sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("connected to db");

    app.listen(3000, () => console.log("server started"));
  })
  .catch((err) => console.log("err", err));
