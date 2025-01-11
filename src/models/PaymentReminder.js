import mongoose from 'mongoose';

const paymentReminderSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0, 'Amount cannot be negative']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Utilities', 'Rent', 'Insurance', 'Subscription', 'Loan', 'Credit Card', 'Other']
    },
    dueDate: {
        type: Date,
        required: [true, 'Due date is required']
    },
    description: {
        type: String,
        trim: true
    },
    recurringType: {
        type: String,
        enum: ['none', 'daily', 'weekly', 'monthly', 'yearly'],
        default: 'none'
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'overdue'],
        default: 'pending'
    },
    notificationDays: {
        type: Number,
        default: 3,
        min: [0, 'Notification days cannot be negative']
    },
    userId: {
        type: String,
        required: [true, 'User ID is required']
    }
}, {
    timestamps: true
});

const PaymentReminder = mongoose.models.PaymentReminder || mongoose.model('PaymentReminder', paymentReminderSchema);

export default PaymentReminder;

