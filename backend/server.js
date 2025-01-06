//imports
const dbConnect = require('./config/db');
const cors = require('cors');
const path = require('path');
const express = require('express');
const app = express();

//creating app

const clientBuildPath = path.join(__dirname,"../client/build");
console.log(clientBuildPath);
app.use(express.static(clientBuildPath));
app.get("*", (req,res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
})


//creating middleware
app.use(cors({
    origin: "https://lastr.onrender.com", // Replace with your frontend URL
    // credentials: true, // Required for cookies or tokens
}));
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
