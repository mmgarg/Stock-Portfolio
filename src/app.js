const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");

require("./db/conn");

//importing json2csv and fs pkg
const Json2csvParser = require("json2csv").Parser;
const fs = require("fs");

const port = process.env.PORT || 8000;

const Register = require("./models/registers");
// const CurrentPrice = require("./models/currentprice");
const StockDetail = require("./models/stockdetail");
const { Parser } = require("json2csv");

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partial_path = path.join(__dirname, "../templates/partials");

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partial_path);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routing
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/trade", (req, res) => {
  res.render("trade");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/stock", (req, res) => {
  res.render("stock");
});


app.get("/export", async (req, res) => {
  res.render("export");
  
  const userJsonData = await StockDetail.find({});
  const fields = [{
    label: 'Name',
    value: 'stocks'
  },{
    label: 'Quantity',
    value: 'quantity'
  },{
    label: 'Price',
    value: 'price'
  },{
    label: 'Current',
    value: 'current_price'
  }];
  const json2csvParser = new Json2csvParser({fields});
  const csv = json2csvParser.parse(userJsonData);
  // console.log(csv);
  fs.writeFile("stock_export.csv", csv, function (error) {
    if (error) throw error;
    console.log("CSV file with data created succesfully!");
  });
});

app.get("*", (req, res) => {
  res.send("404 Error Page");
});

//create stock details in database
app.post("/trade.hbs", async (req, res) => {
  try {
    const stocktest = new StockDetail({
      stocks: req.body.stocks,
      quantity: req.body.quantity,
      price: req.body.price,
      current_price: req.body.current_price,
    });
    const uploaded = await stocktest.save();
    // res.status(201).render("trade");
    
  } catch (error) {
    res.status(400).send(error);
  }
});

//create stock price in database
app.post("/stock.hbs", async (req, res) => {
  try {
    const stockPrice = new CurrentPrice({
      stockname: req.body.stockname,
      currentvalue: req.body.currentvalue,
    });
    const uploaded = await stockPrice.save();
  } catch (error) {
    res.status(400).send(error);
  }
});

// create user in database
app.post("/register.hbs", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.confirm_password;
    if (password === cpassword) {
      const registerUser = new Register({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        confirm_password: cpassword,
      });
      const registered = await registerUser.save();
      res.status(201).render("index", { message: "Account Created" });
    } else {
      console.log("Passwords do not match!");
      res.status(201).render("register", { alert: "Password not matching" });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/index.hbs", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const useremail = await Register.findOne({ email: email });
    if (useremail.password === password) {
      res.status(201).render("trade");
    } else {
      req.send("Invalid login details");
    }
  } catch (error) {
    res.status(400).send("Invalid email or password");
  }
});


app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
