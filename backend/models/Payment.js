import mongoose from 'mongoose'

const paymentSchema = mongoose.Schema({
    bookingId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Booking',
        required : true
    },
    amount : {
        type : Number,
        required : true
    },
    razorpayOrderId : {
        type : String,
        required : true
    },
    razorpayPaymentId : {
        type : String,
    },
    status : {
        type : String,
        enum : ['pending','completed','failed'],
        default : 'pending'
    }
},
{
    timestamps : true
})

const Payment = mongoose.model('Payment',paymentSchema);
export default Payment;