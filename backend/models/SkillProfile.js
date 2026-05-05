import mongoose from 'mongoose';

const skilledProfileSchema = mongoose.Schema(
    {
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User',
            required : true
        },
        skills : {
            type : String,
            required : true
        },
        experience : {
            type : Number,
            default : 0
        },
        hourlyRate : {
            type : Number
        },
        isAvailable : {
            type : Boolean,
            required : true
        },
        bio : {
            type : String
        },
        domain : {
            type : String
        },
        earnings : {
            type : Number,
            default : 0
        },
        ratings : {
            type : Number,
            default : 0
        },
        totalReviews : {
            type : Number,
            default : 0
        }
    },
    {
        timestamps : true
    }
)

const skilledProfile = mongoose.model('skilledProfile',skilledProfileSchema);
export default skilledProfile;