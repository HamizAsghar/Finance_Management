// import mongoose from 'mongoose';

// const incomeSchema = new mongoose.Schema({
//     amount: {
//         type: Number,
//         required: [true, 'Amount is required'],
//         min: [0, 'Amount cannot be negative']
//     },
//     category: {
//         type: String,
//         required: [true, 'Category is required'],
//         enum: ['Salary', 'Freelancing', 'Investments', 'Business', 'Rental', 'Other']
//     },
//     description: {
//         type: String,
//         required: [true, 'Description is required'],
//         trim: true,
//         maxlength: [200, 'Description cannot be more than 200 characters']
//     },
//     date: {
//         type: Date,
//         required: [true, 'Date is required'],
//         default: Date.now
//     }
// }, {
//     timestamps: true
// });

// const Income = mongoose.models.Income || mongoose.model('Income', incomeSchema);

// export default Income;



import mongoose from 'mongoose';

const incomeSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0, 'Amount cannot be negative']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Salary', 'Freelancing', 'Investments', 'Business', 'Rental', 'Other']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: [200, 'Description cannot be more than 200 characters']
    },
    date: {
        type: Date,
        required: [true, 'Date is required'],
        default: Date.now
    },
    userId: {
        type: String,
        required: [true, 'User ID is required']
    }
}, {
    timestamps: true
});

const Income = mongoose.models.Income || mongoose.model('Income', incomeSchema);

export default Income;

