// import mongoose from 'mongoose';

// const expenseSchema = new mongoose.Schema({
//     amount: {
//         type: Number,
//         required: true,
//     },
//     category: {
//         type: String,
//         required: true,
//     },
//     subcategory: {
//         type: String,
//         required: true,
//     },
//     description: {
//         type: String,
//         required: true,
//     },
//     date: {
//         type: Date,
//         required: true,
//     },
// }, { timestamps: true });

// const Expense = mongoose.models.Expense || mongoose.model('Expense', expenseSchema);

// export default Expense;

import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    subcategory: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Expense = mongoose.models.Expense || mongoose.model('Expense', expenseSchema);

export default Expense;











