import mongoose from 'mongoose'

const bookingSchema = mongoose.Schema({
    customerUserId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    skilledPersonId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'skilledProfile',
        required : true
    },
    skills : {
        type : String,
        required : true
    },
    date : {
        type : Date,
        required : true
    },
    time : {
        type : String,
        required : true
    },
    address : {
        type : String,
        required : true
    },
    area : {
        type : String,
        required : true
    },
    amount : {
        type : Number,
        required : true
    },
    status : {
        type : String,
        enum : ['pending','confirmed','completed','cancelled'],
        default : 'pending'
    },
    isPaid : {
        type : Boolean,
    }
},
{
    timestamps : true
})

const Booking = mongoose.model('Booking',bookingSchema);
export default Booking;