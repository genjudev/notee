import mongoose from 'mongoose';

const TabSchema = new mongoose.Schema({
    tabs: {
        type: Object,
        required: [true, 'tabs is required!'],
        trim: true,
    },
    userId: {
        type: String,
        required: [true, 'UserID is required!'],
        trim: true,
    },
    provider: {
        type: Array,
        required: [true, 'Provider is required!'],
        trim: true,
    },
    createdAt: {type: Date, default: Date.now},
});

export default mongoose.models.Tab || mongoose.model('Tab', TabSchema);
