//imports
const dbConnect = require('./config/db');
const cors = require('cors');


//creating app
const express = require('express');
const app = express();

//creating middleware
app.use(cors());
app.use(express.json());


//connecting db to application
dbConnect();

// Expense routes
const expenseRouter = require('./routes/expenseRoute');
app.use("/api/expense", expenseRouter);

//User routes
const UserRouter = require('./routes/userRoute');
app.use("/api/auth", UserRouter);

//portdddddddddddd
const port = 5000;

//starting server
app.listen(port,() => console.log("Server is started on port 5000"));
