const express = require("express");
const bodyParser = require("body-parser");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const path = require("path");
const rootDir = require("./util/path");
const errorController = require("./controllers/error");
const sequelize = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-items");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded());
app.use(express.static(path.join(rootDir, "public")));

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes.routes); // filtering
app.use(shopRoutes);
app.use(errorController.get404);

// Relationships

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);

Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });
// Product.belongsToMany(Order, { through: OrderItem }); // Conversely we can say

// Creates the appropriate tables from what you defined in the files such as  models/product.js file
sequelize
  .sync() // {force: true} in the parens allows to reboot everything but this should not be done in real but for deleopment stages it is used
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "Hannu", email: "example@hotmail.com" });
    }
    return Promise.resolve(user);
  })
  .then((user) => {
    // console.log(user);
    return user.createCart();
  })
  .then((cart) => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));

// "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cGVufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=1296&q=60"

// {"products":[{"id":"0.07070240186882604","qty":2},{"id":"0.10320226115158948","qty":1}],"totalPrice":326.1}

mongodb+srv://Hannu:<password>@cluster0.kovqukw.mongodb.net/?retryWrites=true&w=majority