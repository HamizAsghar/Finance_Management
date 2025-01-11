// import mongoose from 'mongoose';

// const savingsGoalSchema = new mongoose.Schema({
//     title: {
//         type: String,
//         required: true,
//     },
//     targetAmount: {
//         type: Number,
//         required: true,
//     },
//     currentAmount: {
//         type: Number,
//         default: 0,
//     },
//     category: {
//         type: String,
//         required: true,
//         enum: ['Emergency Fund', 'Vacation', 'Education', 'Home', 'Vehicle', 'Retirement', 'Other'],
//     },
//     startDate: {
//         type: Date,
//         required: true,
//         default: Date.now,
//     },
//     targetDate: {
//         type: Date,
//         required: true,
//     },
//     monthlyContribution: {
//         type: Number,
//         required: true,
//     },
//     description: String,
//     status: {
//         type: String,
//         enum: ['In Progress', 'Completed', 'On Hold'],
//         default: 'In Progress',
//     },
// }, {
//     timestamps: true,
// });

// export default mongoose.models.SavingsGoal || mongoose.model('SavingsGoal', savingsGoalSchema);





import mongoose from 'mongoose';

const savingsGoalSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    targetAmount: {
        type: Number,
        required: true,
    },
    currentAmount: {
        type: Number,
        default: 0,
    },
    category: {
        type: String,
        required: true,
        enum: ['Emergency Fund', 'Vacation', 'Education', 'Home', 'Vehicle', 'Retirement', 'Other'],
    },
    startDate: {
        type: Date,
        required: true,
        default: Date.now,
    },
    targetDate: {
        type: Date,
        required: true,
    },
    monthlyContribution: {
        type: Number,
        required: true,
    },
    description: String,
    status: {
        type: String,
        enum: ['In Progress', 'Completed', 'On Hold'],
        default: 'In Progress',
    },
    userId: {
        type: String,
        required: [true, 'User ID is required']
    }
}, {
    timestamps: true,
});

const SavingsGoal = mongoose.models.SavingsGoal || mongoose.model('SavingsGoal', savingsGoalSchema);

export default SavingsGoal;
