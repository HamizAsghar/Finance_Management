// import mongoose from 'mongoose';

// const generalLedgerSchema = new mongoose.Schema({
//     transactionDate: {
//         type: Date,
//         required: true
//     },
//     transactionType: {
//         type: String,
//         enum: ['INCOME', 'EXPENSE', 'SAVINGS', 'BUDGET'],
//         required: true
//     },
//     description: {
//         type: String,
//         required: true
//     },
//     amount: {
//         type: Number,
//         required: true
//     },
//     category: {
//         type: String,
//         required: true
//     },
//     subcategory: String,
//     referenceId: {
//         type: mongoose.Schema.Types.ObjectId,
//         required: true
//     },
//     referenceModel: {
//         type: String,
//         enum: ['Income', 'Expense', 'SavingsGoal', 'Budget'],
//         required: true
//     },
//     debitCredit: {
//         type: String,
//         enum: ['DEBIT', 'CREDIT'],
//         required: true
//     },
//     status: {
//         type: String,
//         enum: ['COMPLETED', 'PENDING', 'CANCELLED'],
//         default: 'COMPLETED'
//     }
// }, {
//     timestamps: true
// });

// const GeneralLedger = mongoose.models.GeneralLedger || mongoose.model('GeneralLedger', generalLedgerSchema);

// export default GeneralLedger;



import mongoose from 'mongoose';

const generalLedgerSchema = new mongoose.Schema({
    transactionDate: {
        type: Date,
        required: true
    },
    transactionType: {
        type: String,
        required: true,
        enum: ['INCOME', 'EXPENSE', 'SAVINGS', 'BUDGET']
    },
    description: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    subcategory: String,
    referenceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    referenceModel: {
        type: String,
        required: true,
        enum: ['Income', 'Expense', 'SavingsGoal', 'Budget']
    },
    debitCredit: {
        type: String,
        required: true,
        enum: ['DEBIT', 'CREDIT']
    },
    userId: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const GeneralLedger = mongoose.models.GeneralLedger || mongoose.model('GeneralLedger', generalLedgerSchema);

export default GeneralLedger;



