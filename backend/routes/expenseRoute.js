const express = require("express");
const { AddExpense, UpdatetExpense, DeleteExpense, GetAllExpense } = require('../controllers/expenseController');
const Protect = require("../middleware/userMiddleware");
const router = express.Router();

router.post('/', Protect, AddExpense);
router.put('/:id', Protect, UpdatetExpense);
router.delete('/:id', Protect, DeleteExpense);
router.get('/', Protect, GetAllExpense);

module.exports = router;

