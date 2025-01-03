const expense = require('../model/expenseModel');

const AddExpense = async(req,res) =>{
    try{
        const {type, amount, category, description, date} = req.body;
        if (!type || !amount || !category || !description || !date) {
            return res.status(400).json({ message: "All fields are required" });
        }
        // Change user to userId
        const newExpense = new expense({userId: req.user._id, type, amount, category, description, date});
        const savedExpense = await newExpense.save();
        res.status(201).json(savedExpense);
    }catch(error){
        res.status(400).json({ message: error.message });
    }
}

const DeleteExpense = async(req,res) =>{
    try{
        const id = req.params.id;
        await expense.findByIdAndDelete(id);
        res.status(200).json("Delted Successfully");
    }catch(error){
        res.status(400).json({ message: error.message });
    }
}

const GetAllExpense = async(req,res) =>{
    try{
        const allExpense = await expense.find({userId: req.user._id}); // Change user to userId
        res.status(200).json(allExpense); // Remove .data
    }catch(error){
        res.status(400).json({ message: error.message });
    }
}


const UpdatetExpense = async(req,res) =>{
    try{
        await expense.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.status(200).json("Updated Successfully");
    }catch(error){
        res.status(400).json({ message: error.message });
    }
}

module.exports = {AddExpense, DeleteExpense, UpdatetExpense, GetAllExpense};