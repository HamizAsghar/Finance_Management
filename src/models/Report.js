// import mongoose from 'mongoose';

// const reportSchema = new mongoose.Schema({
//     type: {
//         type: String,
//         required: true,
//         enum: ['income', 'expense']
//     },
//     startDate: {
//         type: Date,
//         required: true
//     },
//     endDate: {
//         type: Date,
//         required: true
//     },
//     data: {
//         type: Object,
//         required: true
//     },
//     interval: {
//         type: String,
//         required: true,
//         enum: ['weekly', 'monthly', 'yearly']
//     },
//     totalAmount: {
//         type: Number,
//         required: true
//     },
//     categoryBreakdown: {
//         type: Map,
//         of: Number
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     }
// });

// export default mongoose.models.Report || mongoose.model('Report', reportSchema);




import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['income', 'expense']
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    data: {
        type: Object,
        required: true
    },
    interval: {
        type: String,
        required: true,
        enum: ['weekly', 'monthly', 'yearly']
    },
    totalAmount: {
        type: Number,
        required: true
    },
    categoryBreakdown: {
        type: Map,
        of: Number
    },
    userId: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);

export default Report;

