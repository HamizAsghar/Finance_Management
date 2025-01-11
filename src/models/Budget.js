// import mongoose from 'mongoose';

// const budgetSchema = new mongoose.Schema({
//     category: {
//         type: String,
//         required: [true, 'Category is required'],
//         enum: ['Food', 'Transportation', 'Health', 'Entertainment', 'Shopping', 'Bills', 'Others']
//     },
//     amount: {
//         type: Number,
//         required: [true, 'Budget amount is required'],
//         min: [0, 'Budget amount cannot be negative']
//     },
//     spent: {
//         type: Number,
//         default: 0,
//         min: [0, 'Spent amount cannot be negative']
//     },
//     month: {
//         type: Date,
//         required: [true, 'Month is required'],
//         default: Date.now
//     },
//     alerts: [{
//         type: String,
//         date: Date,
//         seen: {
//             type: Boolean,
//             default: false
//         }
//     }]
// }, {
//     timestamps: true
// });

// const Budget = mongoose.models.Budget || mongoose.model('Budget', budgetSchema);

// export default Budget;






import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Food', 'Transportation', 'Health', 'Entertainment', 'Shopping', 'Bills', 'Others']
    },
    amount: {
        type: Number,
        required: [true, 'Budget amount is required'],
        min: [0, 'Budget amount cannot be negative']
    },
    spent: {
        type: Number,
        default: 0,
        min: [0, 'Spent amount cannot be negative']
    },
    month: {
        type: Date,
        required: [true, 'Month is required'],
        default: Date.now
    },
    userId: {
        type: String,
        required: [true, 'User ID is required']
    },
    alerts: [{
        type: String,
        date: Date,
        seen: {
            type: Boolean,
            default: false
        }
    }]
}, {
    timestamps: true
});

const Budget = mongoose.models.Budget || mongoose.model('Budget', budgetSchema);

export default Budget;


