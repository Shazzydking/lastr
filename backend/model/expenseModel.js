const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    userId: { // Change this to userId
        type: mongoose.Schema.Types.ObjectId, 
        ref: "users",
        required: true,
    },
    type: {
        type: String,
        enum: ["income", "expense"],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('expense', ExpenseSchema);